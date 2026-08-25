import { mockDelay } from "@/lib/mock-delay";
import { MOCK_PROGRAM } from "@/lib/portal/mock-store";
import {
  createStudentSession,
  findActivatedStudent,
  findPendingActivation,
  isPendingAlreadyActivated,
  listPendingActivations,
  registerActivatedStudent,
  verifyStoredPassword,
} from "@/lib/portal/student-registry";
import type {
  EmergencyContact,
  MedicalInfo,
  NextOfKin,
  PendingActivation,
  Session,
  StudentProfile,
  User,
} from "@/lib/portal/schema";

export type VerifyIdentityInput = {
  tempRegistrationNumber: string;
  admissionLetterRef: string;
};

export type ActivationProfileInput = {
  phone: string;
  address: string;
  nextOfKin: NextOfKin;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
};

export type CompleteActivationInput = {
  password: string;
  confirmPassword: string;
  profile: ActivationProfileInput;
};

export type AuthResult<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

let verifiedPending: PendingActivation | null = null;

export async function verifyStudentIdentity(
  input: VerifyIdentityInput,
): Promise<AuthResult<PendingActivation>> {
  await mockDelay(500);

  const pending = findPendingActivation(
    input.tempRegistrationNumber,
    input.admissionLetterRef,
  );

  if (!pending) {
    return {
      ok: false,
      message:
        "We could not verify those details. Check your temporary registration number and admission letter reference.",
    };
  }

  if (isPendingAlreadyActivated(pending)) {
    return {
      ok: false,
      message:
        "This student has already activated a portal account. Sign in with your student number or email instead.",
    };
  }

  verifiedPending = pending;

  return {
    ok: true,
    message: "Identity verified. Continue to set your password.",
    data: { ...pending },
  };
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Include at least one number.";
  return null;
}

export async function completeAccountActivation(
  input: CompleteActivationInput,
): Promise<
  AuthResult<{ user: User; session: Session; profile: StudentProfile; programTitle: string }>
> {
  await mockDelay(700);

  if (!verifiedPending) {
    return {
      ok: false,
      message: "Start again from identity verification — your session expired.",
    };
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) {
    return { ok: false, message: passwordError };
  }
  if (input.password !== input.confirmPassword) {
    return { ok: false, message: "Passwords do not match." };
  }

  const { profile } = input;
  if (!profile.phone.trim() || !profile.address.trim()) {
    return { ok: false, message: "Phone and residential address are required." };
  }
  if (!profile.nextOfKin.name.trim() || !profile.nextOfKin.phone.trim()) {
    return { ok: false, message: "Next-of-kin name and phone are required." };
  }
  if (!profile.emergencyContact.name.trim() || !profile.emergencyContact.phone.trim()) {
    return { ok: false, message: "Emergency contact name and phone are required." };
  }
  if (!profile.medicalInfo.bloodGroup.trim()) {
    return { ok: false, message: "Blood group is required for institutional records." };
  }

  try {
    const registered = registerActivatedStudent(verifiedPending, {
      passwordHash: `mock-hash:${input.password}`,
      phone: profile.phone.trim(),
      address: profile.address.trim(),
      nextOfKin: {
        name: profile.nextOfKin.name.trim(),
        relationship: profile.nextOfKin.relationship.trim() || "Guardian",
        phone: profile.nextOfKin.phone.trim(),
        email: profile.nextOfKin.email.trim(),
      },
      emergencyContact: {
        name: profile.emergencyContact.name.trim(),
        relationship: profile.emergencyContact.relationship.trim() || "Relative",
        phone: profile.emergencyContact.phone.trim(),
      },
      medicalInfo: {
        bloodGroup: profile.medicalInfo.bloodGroup.trim(),
        allergies: profile.medicalInfo.allergies.trim() || "None known",
        chronicConditions: profile.medicalInfo.chronicConditions.trim() || "None",
        disabilities: profile.medicalInfo.disabilities.trim() || "None",
        doctorName: profile.medicalInfo.doctorName.trim(),
        doctorPhone: profile.medicalInfo.doctorPhone.trim(),
      },
    });

    verifiedPending = null;

    return {
      ok: true,
      message: "Account activated successfully.",
      data: {
        user: registered.user,
        session: createStudentSession(registered.user),
        profile: registered.profile,
        programTitle: MOCK_PROGRAM.title,
      },
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? err.message
          : "Activation failed. Contact the registry office for help.",
    };
  }
}

export function getDemoActivationHints() {
  return listPendingActivations();
}

/** Example returning student for the login screen hint */
export const STUDENT_DEMO_CREDENTIALS = {
  studentNumber: "MBSNM/NS/2024/018",
  email: "nagudi.sarah@student.mbsnm.org",
  password: "Student@2026",
} as const;

export async function loginStudent(
  identifier: string,
  password: string,
): Promise<
  AuthResult<{ user: User; session: Session; profile: StudentProfile; programTitle: string }>
> {
  await mockDelay(450);

  if (!identifier.trim() || !password) {
    return { ok: false, message: "Enter your student number or email and password." };
  }

  const match = findActivatedStudent(identifier);
  if (!match) {
    return {
      ok: false,
      message:
        "We could not find an activated student account with those details. Check your student number or email, or activate your account first.",
    };
  }

  if (!verifyStoredPassword(password, match.user.passwordHash)) {
    return { ok: false, message: "Incorrect password. Try again or contact the registry office." };
  }

  return {
    ok: true,
    message: "Signed in successfully.",
    data: {
      user: match.user,
      session: createStudentSession(match.user),
      profile: match.profile,
      programTitle: MOCK_PROGRAM.title,
    },
  };
}
