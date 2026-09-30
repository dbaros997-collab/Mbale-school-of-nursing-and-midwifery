import type {

  EmergencyContact,

  MedicalInfo,

  NextOfKin,

  PendingActivation,

  Session,

  StudentProfile,

  User,

} from "@/lib/portal/schema";

import { createStudentSession } from "@/lib/portal/student-session-storage";



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

  pending: PendingActivation;

};



export type AuthResult<T> = {

  ok: boolean;

  message: string;

  data?: T;

};



export async function verifyStudentIdentity(

  input: VerifyIdentityInput,

): Promise<AuthResult<PendingActivation>> {

  const res = await fetch("/api/portal/activation/verify", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(input),

  });

  const json = (await res.json()) as AuthResult<PendingActivation>;

  return json;

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

  const res = await fetch("/api/portal/activation/complete", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(input),

  });

  const json = (await res.json()) as AuthResult<{

    user: User;

    profile: StudentProfile;

    programTitle: string;

  }>;



  if (!json.ok || !json.data) {

    return { ok: false, message: json.message };

  }



  return {

    ok: true,

    message: json.message,

    data: {

      user: json.data.user,

      profile: json.data.profile,

      programTitle: json.data.programTitle,

      session: createStudentSession(json.data.user),

    },

  };

}



export async function loginStudent(

  identifier: string,

  password: string,

): Promise<

  AuthResult<{ user: User; session: Session; profile: StudentProfile; programTitle: string }>

> {

  const res = await fetch("/api/portal/auth/login", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ identifier, password }),

  });

  const json = (await res.json()) as AuthResult<{

    user: User;

    profile: StudentProfile;

    programTitle: string;

  }>;



  if (!json.ok || !json.data) {

    return { ok: false, message: json.message };

  }



  return {

    ok: true,

    message: json.message,

    data: {

      user: json.data.user,

      profile: json.data.profile,

      programTitle: json.data.programTitle,

      session: createStudentSession(json.data.user),

    },

  };

}


