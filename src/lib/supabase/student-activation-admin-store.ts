import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type PortalActivationRecord = {
  studentId: string;
  fullName: string;
  email: string;
  tempRegistrationNumber: string;
  admissionLetterRef: string;
  studentNumber: string;
  activatedAt: string | null;
  createdAt: string;
};

type ActivationRow = {
  student_id: string;
  full_name: string;
  email: string;
  temp_registration_number: string;
  admission_letter_ref: string;
  student_number: string;
  activated_at: string | null;
  created_at: string;
};

function mapRow(row: ActivationRow): PortalActivationRecord {
  return {
    studentId: row.student_id,
    fullName: row.full_name,
    email: row.email,
    tempRegistrationNumber: row.temp_registration_number,
    admissionLetterRef: row.admission_letter_ref,
    studentNumber: row.student_number,
    activatedAt: row.activated_at,
    createdAt: row.created_at,
  };
}

/** Admin finance dashboard — portal activation rows from Supabase. */
export async function listPortalActivationRecords(limit = 24): Promise<PortalActivationRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("student_portal_activation")
    .select(
      "student_id,full_name,email,temp_registration_number,admission_letter_ref,student_number,activated_at,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[listPortalActivationRecords]", error);
    return [];
  }

  return (data as ActivationRow[]).map(mapRow);
}
