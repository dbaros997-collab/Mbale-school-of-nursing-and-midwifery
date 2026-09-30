import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PendingActivation } from "@/lib/portal/schema";

export type PersistActivationResult =
  | { ok: true; studentId: string }
  | { ok: false; code: "not_configured" | "duplicate" | "db_error"; message: string };

export async function persistStudentPortalActivation(input: {
  studentId: string;
  pending: PendingActivation;
}): Promise<PersistActivationResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, code: "not_configured", message: "Supabase is not configured." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("student_portal_activation").insert({
      student_id: input.studentId,
      temp_registration_number: input.pending.tempRegistrationNumber,
      admission_letter_ref: input.pending.admissionLetterRef,
      student_number: input.pending.studentNumber,
      full_name: input.pending.fullName,
      email: input.pending.email,
      program_id: input.pending.programId,
      phone: input.pending.phone,
    });

    if (error) {
      const duplicate = error.code === "23505";
      return {
        ok: false,
        code: duplicate ? "duplicate" : "db_error",
        message: duplicate
          ? "Activation credentials already exist for this student or duplicate temp/admission reference."
          : error.message,
      };
    }

    return { ok: true, studentId: input.studentId };
  } catch (err) {
    return {
      ok: false,
      code: "db_error",
      message: err instanceof Error ? err.message : "Database error.",
    };
  }
}
