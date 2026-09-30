import type { PendingActivation, Session, StudentProfile, User } from "./schema";
import {
  generateUniqueActivationCredentials,
  isValidAdmissionLetterRef,
  isValidTempRegistrationNumber,
  normalizeActivationToken,
  validateActivationCredentialIndex,
  type ActivationCredentialIndex,
  type ActivationIntegrityIssue,
} from "./activation-credentials";

const REGISTRY_STORAGE_KEY = "mbsnm-student-registry";

export type RegisteredStudent = {
  user: User;
  profile: StudentProfile;
};

const DEFAULT_PENDING: PendingActivation[] = [];
const SEED_ACTIVATED: RegisteredStudent[] = [];

type RegistrySnapshot = {
  students: RegisteredStudent[];
  pending: PendingActivation[];
};

let registry: RegistrySnapshot = {
  students: cloneStudents(SEED_ACTIVATED),
  pending: DEFAULT_PENDING.map((p) => ({ ...p })),
};

let activeUserId: string | null = null;

type GlobalsSync = (user: User, profile: StudentProfile) => void;
let syncGlobals: GlobalsSync | null = null;

type ActivatedStudentHook = (profile: StudentProfile) => void;
let onStudentActivated: ActivatedStudentHook | null = null;

export function registerStudentRegistrySync(fn: GlobalsSync) {
  syncGlobals = fn;
}

export function registerActivatedStudentFeeHook(fn: ActivatedStudentHook) {
  onStudentActivated = fn;
}

function cloneProfile(profile: StudentProfile): StudentProfile {
  return {
    ...profile,
    nextOfKin: { ...profile.nextOfKin },
    emergencyContact: { ...profile.emergencyContact },
    medicalInfo: { ...profile.medicalInfo },
  };
}

function cloneStudents(students: RegisteredStudent[]): RegisteredStudent[] {
  return students.map(({ user, profile }) => ({
    user: { ...user },
    profile: cloneProfile(profile),
  }));
}

function normalizeToken(value: string) {
  return normalizeActivationToken(value);
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function studentSlug(studentNumber: string) {
  return studentNumber.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
}

function persistRegistry() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));
  } catch {
    /* ignore quota / private mode */
  }
}

function loadRegistryFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as RegistrySnapshot;
    if (Array.isArray(parsed.students) && Array.isArray(parsed.pending)) {
      registry = {
        students: cloneStudents(parsed.students),
        pending: parsed.pending.map((p) => ({ ...p })),
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
}

if (typeof window !== "undefined") {
  loadRegistryFromStorage();
}

function syncActiveToGlobals() {
  const active = activeUserId
    ? registry.students.find((s) => s.user.id === activeUserId)
    : null;
  if (active && syncGlobals) {
    syncGlobals({ ...active.user }, cloneProfile(active.profile));
  }
}

export function setActiveStudent(userId: string): RegisteredStudent | null {
  const match = registry.students.find((s) => s.user.id === userId);
  if (!match) return null;
  activeUserId = userId;
  syncActiveToGlobals();
  return {
    user: { ...match.user },
    profile: cloneProfile(match.profile),
  };
}

export function getActiveStudentUserId() {
  return activeUserId;
}

export function buildActivationCredentialIndex(): ActivationCredentialIndex {
  const index: ActivationCredentialIndex = {
    tempRegistrationNumbers: new Set<string>(),
    admissionLetterRefs: new Set<string>(),
    studentNumbers: new Set<string>(),
  };

  for (const pending of registry.pending) {
    index.tempRegistrationNumbers.add(normalizeToken(pending.tempRegistrationNumber));
    index.admissionLetterRefs.add(normalizeToken(pending.admissionLetterRef));
    index.studentNumbers.add(normalizeToken(pending.studentNumber));
  }

  for (const { profile } of registry.students) {
    index.admissionLetterRefs.add(normalizeToken(profile.admissionLetterRef));
    index.studentNumbers.add(normalizeToken(profile.studentNumber));
    if (profile.tempRegistrationNumber) {
      index.tempRegistrationNumbers.add(normalizeToken(profile.tempRegistrationNumber));
    }
  }

  return index;
}

export function validateActivationRegistryIntegrity(): ActivationIntegrityIssue[] {
  return validateActivationCredentialIndex(buildActivationCredentialIndex());
}

export type AdmitPortalStudentInput = {
  fullName: string;
  email: string;
  phone: string;
  programId: string;
  studentNumber?: string;
  tempRegistrationNumber?: string;
  admissionLetterRef?: string;
  year?: number;
};

function assertCredentialAvailable(
  index: ActivationCredentialIndex,
  tempRegistrationNumber: string,
  admissionLetterRef: string,
  studentNumber: string,
) {
  const tempKey = normalizeToken(tempRegistrationNumber);
  const letterKey = normalizeToken(admissionLetterRef);
  const studentKey = normalizeToken(studentNumber);

  if (index.tempRegistrationNumbers.has(tempKey)) {
    throw new Error(`Temporary registration number already in use: ${tempRegistrationNumber}`);
  }
  if (index.admissionLetterRefs.has(letterKey)) {
    throw new Error(`Admission letter reference already in use: ${admissionLetterRef}`);
  }
  if (index.studentNumbers.has(studentKey)) {
    throw new Error(`Student number already in use: ${studentNumber}`);
  }
}

/** Issue unique portal activation credentials for a newly admitted student. */
export function admitStudentForPortalActivation(
  input: AdmitPortalStudentInput,
  externalIndex?: ActivationCredentialIndex,
): PendingActivation {
  const email = normalizeEmail(input.email);
  if (
    registry.pending.some((p) => normalizeEmail(p.email) === email) ||
    registry.students.some(
      ({ profile, user }) =>
        user.accountActivated && normalizeEmail(profile.email) === email,
    )
  ) {
    throw new Error("A portal activation record already exists for this email address.");
  }

  const index = externalIndex ?? buildActivationCredentialIndex();

  let tempRegistrationNumber = input.tempRegistrationNumber?.trim() ?? "";
  let admissionLetterRef = input.admissionLetterRef?.trim() ?? "";
  let studentNumber = input.studentNumber?.trim() ?? "";

  if (tempRegistrationNumber || admissionLetterRef || studentNumber) {
    if (!tempRegistrationNumber || !admissionLetterRef || !studentNumber) {
      throw new Error(
        "Provide all three identifiers (temporary registration, admission letter, student number) or none for auto-generation.",
      );
    }
    if (!isValidTempRegistrationNumber(tempRegistrationNumber)) {
      throw new Error("Temporary registration number must match TMP/MBSNM/YYYY/XXX.");
    }
    if (!isValidAdmissionLetterRef(admissionLetterRef)) {
      throw new Error("Admission letter reference must match ADM-MBSNM-YYYY-XXXX.");
    }
    assertCredentialAvailable(index, tempRegistrationNumber, admissionLetterRef, studentNumber);
  } else {
    const generated = generateUniqueActivationCredentials(index, input.year);
    tempRegistrationNumber = generated.tempRegistrationNumber;
    admissionLetterRef = generated.admissionLetterRef;
    studentNumber = generated.studentNumber;
  }

  const pending: PendingActivation = {
    tempRegistrationNumber,
    admissionLetterRef,
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    programId: input.programId,
    studentNumber,
  };

  registry.pending = [...registry.pending, pending];
  persistRegistry();
  return { ...pending };
}

export function listPendingActivations(): PendingActivation[] {
  return registry.pending.map((p) => ({ ...p }));
}

export function listActivatedStudents(): RegisteredStudent[] {
  return cloneStudents(registry.students);
}

export function findPendingActivation(
  tempRegistrationNumber: string,
  admissionLetterRef: string,
): PendingActivation | null {
  if (!isValidTempRegistrationNumber(tempRegistrationNumber)) {
    return null;
  }
  if (!isValidAdmissionLetterRef(admissionLetterRef)) {
    return null;
  }

  const temp = normalizeToken(tempRegistrationNumber);
  const letter = normalizeToken(admissionLetterRef);
  const matches = registry.pending.filter(
    (p) =>
      normalizeToken(p.tempRegistrationNumber) === temp &&
      normalizeToken(p.admissionLetterRef) === letter,
  );

  if (matches.length !== 1) {
    return null;
  }

  return { ...matches[0]! };
}

export function findActivatedStudent(identifier: string): RegisteredStudent | null {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  const asStudentNo = normalizeToken(trimmed);
  const asEmail = normalizeEmail(trimmed);

  const match = registry.students.find(({ profile, user }) => {
    if (!user.accountActivated) return false;
    const studentNo = normalizeToken(profile.studentNumber);
    const email = normalizeEmail(profile.email);
    const userEmail = normalizeEmail(user.email);
    return (
      studentNo === asStudentNo ||
      email === asEmail ||
      userEmail === asEmail
    );
  });

  if (!match) return null;
  return {
    user: { ...match.user },
    profile: cloneProfile(match.profile),
  };
}

export function isPendingAlreadyActivated(pending: PendingActivation): boolean {
  const studentNo = normalizeToken(pending.studentNumber);
  const email = normalizeEmail(pending.email);
  return registry.students.some(
    ({ profile, user }) =>
      user.accountActivated &&
      (normalizeToken(profile.studentNumber) === studentNo ||
        normalizeEmail(profile.email) === email),
  );
}

export type ActivationProfilePayload = {
  passwordHash: string;
  phone: string;
  address: string;
  nextOfKin: StudentProfile["nextOfKin"];
  emergencyContact: StudentProfile["emergencyContact"];
  medicalInfo: StudentProfile["medicalInfo"];
};

export function registerActivatedStudent(
  pending: PendingActivation,
  input: ActivationProfilePayload,
): RegisteredStudent {
  if (isPendingAlreadyActivated(pending)) {
    throw new Error("This student has already activated their portal account.");
  }

  const userId = `user-${studentSlug(pending.studentNumber)}`;
  const profileId = `stu-${studentSlug(pending.studentNumber)}`;

  const record: RegisteredStudent = {
    user: {
      id: userId,
      email: pending.email,
      passwordHash: input.passwordHash,
      role: "student",
      createdAt: new Date().toISOString(),
      accountActivated: true,
      mustChangePassword: false,
    },
    profile: {
      id: profileId,
      userId,
      studentNumber: pending.studentNumber,
      tempRegistrationNumber: null,
      admissionLetterRef: pending.admissionLetterRef,
      fullName: pending.fullName,
      programId: pending.programId,
      phone: input.phone,
      email: pending.email,
      address: input.address,
      nextOfKin: { ...input.nextOfKin },
      emergencyContact: { ...input.emergencyContact },
      medicalInfo: { ...input.medicalInfo },
      creditsCompleted: 0,
      creditsRequired: 120,
      cumulativeGpa: 0,
      semesterGpa: 0,
    },
  };

  registry.students = [...registry.students, record];
  registry.pending = registry.pending.filter(
    (p) =>
      normalizeToken(p.tempRegistrationNumber) !== normalizeToken(pending.tempRegistrationNumber),
  );

  persistRegistry();
  activeUserId = userId;
  syncActiveToGlobals();
  onStudentActivated?.(cloneProfile(record.profile));

  return {
    user: { ...record.user },
    profile: cloneProfile(record.profile),
  };
}

export function createStudentSession(user: User): Session {
  return {
    id: `sess-${user.id}`,
    userId: user.id,
    role: "student",
    token: `mock-jwt.student.${user.id}`,
    expiresAt: "2027-01-01T00:00:00.000Z",
  };
}

export function verifyStoredPassword(password: string, passwordHash: string): boolean {
  return passwordHash === `mock-hash:${password}`;
}

/** @deprecated Use listPendingActivations — kept for legacy imports */
export const MOCK_PENDING_ACTIVATION = null;

/** Test-only reset — do not use in production flows. */
export function __resetStudentRegistryForTests(snapshot?: RegistrySnapshot) {
  registry = snapshot
    ? {
        students: cloneStudents(snapshot.students),
        pending: snapshot.pending.map((p) => ({ ...p })),
      }
    : {
        students: cloneStudents(SEED_ACTIVATED),
        pending: [],
      };
  activeUserId = registry.students[0]?.user.id ?? null;
}

const seedIntegrity = validateActivationRegistryIntegrity();
if (seedIntegrity.length > 0 && typeof process !== "undefined") {
  const summary = seedIntegrity.map((i) => i.message).join("; ");
  console.warn(`[student-registry] activation seed integrity: ${summary}`);
}
