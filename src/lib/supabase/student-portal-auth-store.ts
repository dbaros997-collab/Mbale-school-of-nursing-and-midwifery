import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { hashPortalPassword, verifyPortalPassword } from "@/lib/portal/password-hash";
import type {
  EmergencyContact,
  MedicalInfo,
  NextOfKin,
  PendingActivation,
  StudentProfile,
  User,
} from "@/lib/portal/schema";

type ActivationRow = {
  student_id: string;
  temp_registration_number: string;
  admission_letter_ref: string;
  student_number: string;
  full_name: string;
  email: string;
  program_id: string;
  phone: string | null;
  activated_at: string | null;
};

function normalizeToken(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function mapPending(row: ActivationRow): PendingActivation {
  return {
    tempRegistrationNumber: row.temp_registration_number,
    admissionLetterRef: row.admission_letter_ref,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    programId: row.program_id,
    studentNumber: row.student_number,
  };
}

export async function findPendingActivationInDb(
  tempRegistrationNumber: string,
  admissionLetterRef: string,
): Promise<PendingActivation | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("student_portal_activation")
    .select(
      "student_id, temp_registration_number, admission_letter_ref, student_number, full_name, email, program_id, phone, activated_at",
    )
    .is("activated_at", null)
    .eq("temp_registration_number", tempRegistrationNumber.trim())
    .eq("admission_letter_ref", admissionLetterRef.trim())
    .maybeSingle();

  if (error || !data) return null;
  if ((data as ActivationRow).activated_at) return null;
  return mapPending(data as ActivationRow);
}

export type CompletePortalActivationInput = {
  pending: PendingActivation;
  password: string;
  phone: string;
  address: string;
  nextOfKin: NextOfKin;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
};

export async function completePortalActivationInDb(
  input: CompletePortalActivationInput,
): Promise<
  | { ok: true; user: User; profile: StudentProfile; studentId: string }
  | { ok: false; message: string }
> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Student portal database is not configured." };
  }

  const pendingRow = await findPendingActivationInDb(
    input.pending.tempRegistrationNumber,
    input.pending.admissionLetterRef,
  );
  if (!pendingRow) {
    return {
      ok: false,
      message: "Activation session expired or credentials are no longer valid.",
    };
  }

  const supabase = createAdminClient();
  const { data: activation } = await supabase
    .from("student_portal_activation")
    .select("student_id")
    .eq("temp_registration_number", input.pending.tempRegistrationNumber.trim())
    .eq("admission_letter_ref", input.pending.admissionLetterRef.trim())
    .maybeSingle();

  const studentId = activation?.student_id ? String(activation.student_id) : null;
  if (!studentId) {
    return { ok: false, message: "Student record not found for activation." };
  }

  const userId = `user-${studentId}`;
  const passwordHash = hashPortalPassword(input.password);

  const profile: StudentProfile = {
    id: studentId,
    userId,
    studentNumber: pendingRow.studentNumber,
    tempRegistrationNumber: null,
    admissionLetterRef: pendingRow.admissionLetterRef,
    fullName: pendingRow.fullName,
    programId: pendingRow.programId,
    phone: input.phone.trim(),
    email: pendingRow.email,
    address: input.address.trim(),
    nextOfKin: { ...input.nextOfKin },
    emergencyContact: { ...input.emergencyContact },
    medicalInfo: { ...input.medicalInfo },
    creditsCompleted: 0,
    creditsRequired: 120,
    cumulativeGpa: 0,
    semesterGpa: 0,
  };

  const { error: accountError } = await supabase.from("student_portal_accounts").insert({
    student_id: studentId,
    user_id: userId,
    email: pendingRow.email,
    password_hash: passwordHash,
    profile,
  });

  if (accountError) {
    const duplicate = accountError.code === "23505";
    return {
      ok: false,
      message: duplicate
        ? "This student has already activated a portal account."
        : accountError.message,
    };
  }

  await supabase
    .from("student_portal_activation")
    .update({ activated_at: new Date().toISOString() })
    .eq("student_id", studentId);

  await supabase
    .from("students")
    .update({ phone: input.phone.trim(), status: "active" })
    .eq("id", studentId);

  const user: User = {
    id: userId,
    email: pendingRow.email,
    passwordHash,
    role: "student",
    createdAt: new Date().toISOString(),
    accountActivated: true,
    mustChangePassword: false,
  };

  return { ok: true, user, profile, studentId };
}

export async function loginPortalStudentInDb(
  identifier: string,
  password: string,
): Promise<
  | { ok: true; user: User; profile: StudentProfile }
  | { ok: false; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Student portal sign-in requires a live database connection.",
    };
  }

  const trimmed = identifier.trim();
  if (!trimmed || !password) {
    return { ok: false, message: "Enter your student number or email and password." };
  }

  const supabase = createAdminClient();
  const asEmail = trimmed.toLowerCase();
  const asStudentNo = normalizeToken(trimmed);

  let accountQuery = supabase
    .from("student_portal_accounts")
    .select("student_id, user_id, email, password_hash, profile")
    .limit(1);

  if (trimmed.includes("@")) {
    accountQuery = accountQuery.ilike("email", asEmail);
  } else {
    const { data: activation } = await supabase
      .from("student_portal_activation")
      .select("student_id")
      .eq("student_number", trimmed)
      .maybeSingle();
    if (!activation?.student_id) {
      return {
        ok: false,
        message:
          "We could not find an activated student account with those details. Check your student number or email, or activate your account first.",
      };
    }
    accountQuery = accountQuery.eq("student_id", String(activation.student_id));
  }

  const { data: account, error } = await accountQuery.maybeSingle();
  if (error || !account) {
    return {
      ok: false,
      message:
        "We could not find an activated student account with those details. Check your student number or email, or activate your account first.",
    };
  }

  if (!verifyPortalPassword(password, String(account.password_hash))) {
    return { ok: false, message: "Incorrect password. Try again or contact the registry office." };
  }

  const storedProfile = account.profile as StudentProfile | null;
  const profile: StudentProfile =
    storedProfile && storedProfile.id
      ? {
          ...storedProfile,
          nextOfKin: { ...storedProfile.nextOfKin },
          emergencyContact: { ...storedProfile.emergencyContact },
          medicalInfo: { ...storedProfile.medicalInfo },
        }
      : {
          id: String(account.student_id),
          userId: String(account.user_id),
          studentNumber: asStudentNo,
          tempRegistrationNumber: null,
          admissionLetterRef: "",
          fullName: "",
          programId: "course-dn-direct",
          phone: "",
          email: String(account.email),
          address: "",
          nextOfKin: { name: "", relationship: "", phone: "", email: "" },
          emergencyContact: { name: "", relationship: "", phone: "" },
          medicalInfo: {
            bloodGroup: "",
            allergies: "",
            chronicConditions: "",
            disabilities: "",
            doctorName: "",
            doctorPhone: "",
          },
          creditsCompleted: 0,
          creditsRequired: 120,
          cumulativeGpa: 0,
          semesterGpa: 0,
        };

  const user: User = {
    id: String(account.user_id),
    email: String(account.email),
    passwordHash: String(account.password_hash),
    role: "student",
    createdAt: new Date().toISOString(),
    accountActivated: true,
    mustChangePassword: false,
  };

  return { ok: true, user, profile };
}
