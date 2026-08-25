import type { PendingActivation, Session, StudentProfile, User } from "./schema";

const REGISTRY_STORAGE_KEY = "mbsnm-student-registry";

export type RegisteredStudent = {
  user: User;
  profile: StudentProfile;
};

/** Students awaiting first-time portal activation */
const DEFAULT_PENDING: PendingActivation[] = [
  {
    tempRegistrationNumber: "TMP/MBSNM/2026/042",
    admissionLetterRef: "ADM-MBSNM-2026-1184",
    fullName: "Auma Grace",
    email: "auma.grace@student.mbsnm.org",
    phone: "+256 704 888 301",
    programId: "prog-dn",
    studentNumber: "MBSNM/NS/2026/042",
  },
  {
    tempRegistrationNumber: "TMP/MBSNM/2026/089",
    admissionLetterRef: "ADM-MBSNM-2026-1290",
    fullName: "Okello James",
    email: "okello.james@student.mbsnm.org",
    phone: "+256 701 222 445",
    programId: "prog-dn",
    studentNumber: "MBSNM/NS/2026/089",
  },
  {
    tempRegistrationNumber: "TMP/MBSNM/2026/115",
    admissionLetterRef: "ADM-MBSNM-2026-1402",
    fullName: "Nabirye Faith",
    email: "nabirye.faith@student.mbsnm.org",
    phone: "+256 708 333 901",
    programId: "prog-dn",
    studentNumber: "MBSNM/NS/2026/115",
  },
];

/** Pre-activated continuing student (demo) */
const SEED_ACTIVATED: RegisteredStudent[] = [
  {
    user: {
      id: "user-sarah",
      email: "nagudi.sarah@student.mbsnm.org",
      passwordHash: "mock-hash:Student@2026",
      role: "student",
      createdAt: "2024-08-01T08:00:00.000Z",
      accountActivated: true,
      mustChangePassword: false,
    },
    profile: {
      id: "stu-sarah",
      userId: "user-sarah",
      studentNumber: "MBSNM/NS/2024/018",
      tempRegistrationNumber: null,
      admissionLetterRef: "ADM-MBSNM-2024-018",
      fullName: "Nagudi Sarah",
      programId: "prog-dn",
      phone: "+256 700 123 456",
      email: "nagudi.sarah@student.mbsnm.org",
      address: "Mbale Municipality, Eastern Uganda",
      nextOfKin: {
        name: "Nagudi Peter",
        relationship: "Father",
        phone: "+256 772 987 654",
        email: "peter.nagudi@email.com",
      },
      emergencyContact: {
        name: "Nagudi Mary",
        relationship: "Mother",
        phone: "+256 701 555 221",
      },
      medicalInfo: {
        bloodGroup: "O+",
        allergies: "None known",
        chronicConditions: "None",
        disabilities: "None",
        doctorName: "Dr. Okello James",
        doctorPhone: "+256 750 111 222",
      },
      creditsCompleted: 48,
      creditsRequired: 120,
      cumulativeGpa: 3.42,
      semesterGpa: 3.55,
    },
  },
];

type RegistrySnapshot = {
  students: RegisteredStudent[];
  pending: PendingActivation[];
};

let registry: RegistrySnapshot = {
  students: cloneStudents(SEED_ACTIVATED),
  pending: DEFAULT_PENDING.map((p) => ({ ...p })),
};

let activeUserId: string | null = SEED_ACTIVATED[0]?.user.id ?? null;

type GlobalsSync = (user: User, profile: StudentProfile) => void;
let syncGlobals: GlobalsSync | null = null;

export function registerStudentRegistrySync(fn: GlobalsSync) {
  syncGlobals = fn;
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
  return value.trim().toUpperCase().replace(/\s+/g, "");
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
  const temp = normalizeToken(tempRegistrationNumber);
  const letter = normalizeToken(admissionLetterRef);
  const match = registry.pending.find(
    (p) =>
      normalizeToken(p.tempRegistrationNumber) === temp &&
      normalizeToken(p.admissionLetterRef) === letter,
  );
  return match ? { ...match } : null;
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

/** @deprecated Use listPendingActivations — kept for mock-store compatibility */
export const MOCK_PENDING_ACTIVATION = DEFAULT_PENDING[0];
