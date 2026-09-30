import { readMicrosoftSession } from "@/lib/microsoft/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type CheckoutCustomer = {
  studentId: string;
  fullName: string;
  email: string;
  phone?: string;
};

type StudentRow = {
  full_name: string;
  email: string;
  phone: string | null;
};

async function loadStudentRow(studentId: string): Promise<StudentRow | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("students")
      .select("full_name,email,phone")
      .eq("id", studentId)
      .maybeSingle();
    if (error || !data) return null;
    return data as StudentRow;
  } catch {
    return null;
  }
}

/**
 * Resolves Flutterwave customer fields: Microsoft session first, then academic record / demo profile.
 */
export async function resolveCheckoutCustomer(input: {
  studentId: string;
  hintName?: string;
  hintEmail?: string;
}): Promise<{ ok: true; customer: CheckoutCustomer } | { ok: false; message: string }> {
  const studentId = input.studentId.trim();
  if (!studentId) {
    return { ok: false, message: "Student id is required for checkout." };
  }

  const session = await readMicrosoftSession();
  const row = await loadStudentRow(studentId);

  const fullName =
    session?.displayName?.trim() || row?.full_name?.trim() || input.hintName?.trim() || "";

  const email =
    session?.email?.trim() || row?.email?.trim() || input.hintEmail?.trim() || "";

  const phone = row?.phone?.trim() || undefined;

  if (row?.email && session?.email) {
    const sessionEmail = session.email.trim().toLowerCase();
    const recordEmail = row.email.trim().toLowerCase();
    if (sessionEmail !== recordEmail) {
      return {
        ok: false,
        message: "Your sign-in email does not match this student fee account.",
      };
    }
  }

  if (!fullName || !email) {
    return {
      ok: false,
      message:
        "We could not resolve your student record for checkout. Sign in again or contact finance.",
    };
  }

  return {
    ok: true,
    customer: { studentId, fullName, email, phone: phone || undefined },
  };
}
