import type { ApplicationRecord } from "@/lib/admissions/types";
import type { ActivationCredentialIndex } from "@/lib/portal/activation-credentials";
import {
  admitStudentForPortalActivation,
  buildActivationCredentialIndex,
  validateActivationRegistryIntegrity,
  type AdmitPortalStudentInput,
} from "@/lib/portal/student-registry";
import type { PendingActivation } from "@/lib/portal/schema";
import { persistStudentPortalActivation } from "@/lib/supabase/student-activation-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { listPortalActivationRecords } from "@/lib/supabase/student-activation-admin-store";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function studentSlug(studentNumber: string) {
  return studentNumber.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
}

function mapProgramToCourse(programId: string) {
  if (programId.includes("midwifery") || programId.includes("dm")) return "course-dm-direct";
  if (programId.includes("cert") || programId === "prog-cn") return "course-cn";
  return "course-dn-direct";
}

async function buildSupabaseActivationIndex(): Promise<ActivationCredentialIndex> {
  const index = buildActivationCredentialIndex();
  if (!isSupabaseConfigured()) return index;

  const rows = await listPortalActivationRecords(500);
  for (const row of rows) {
    index.tempRegistrationNumbers.add(row.tempRegistrationNumber.trim().toUpperCase());
    index.admissionLetterRefs.add(row.admissionLetterRef.trim().toUpperCase());
    index.studentNumbers.add(row.studentNumber.trim().toUpperCase());
  }
  return index;
}

async function ensureStudentRow(input: {
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  programId: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("students").upsert(
    {
      id: input.studentId,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      course_enrolled: mapProgramToCourse(input.programId),
      enrollment_date: new Date().toISOString().slice(0, 10),
      status: "pending",
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export type AdmitApplicantResult = {
  ok: boolean;
  message: string;
  pending?: PendingActivation;
  studentId?: string;
};

export async function admitApplicantToStudentPortal(
  application: ApplicationRecord,
): Promise<AdmitApplicantResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Portal activation requires Supabase. Configure the database before admitting students.",
    };
  }

  const index = await buildSupabaseActivationIndex();

  try {
    const pending = admitStudentForPortalActivation(
      {
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        programId: application.programId,
      },
      index,
    );

    const studentId = `stu-${studentSlug(pending.studentNumber)}`;
    await ensureStudentRow({
      studentId,
      fullName: pending.fullName,
      email: pending.email,
      phone: pending.phone,
      programId: pending.programId,
    });

    const persisted = await persistStudentPortalActivation({ studentId, pending });
    if (!persisted.ok) {
      return { ok: false, message: persisted.message };
    }

    const integrity = validateActivationRegistryIntegrity();
    if (integrity.length > 0) {
      return {
        ok: false,
        message: integrity[0]?.message ?? "Activation registry integrity check failed.",
      };
    }

    return {
      ok: true,
      message: `Portal activation credentials issued for ${pending.fullName}.`,
      pending,
      studentId,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not issue activation credentials.",
    };
  }
}

/** @deprecated Use buildSupabaseActivationIndex — kept for activation test scripts */
export const buildFullActivationCredentialIndex = buildSupabaseActivationIndex;

export function verifyActivationRegistry(): ReturnType<typeof validateActivationRegistryIntegrity> {
  return validateActivationRegistryIntegrity();
}

export async function registerNewStudentWithPortalActivation(
  input: AdmitPortalStudentInput,
): Promise<AdmitApplicantResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Portal activation requires Supabase.",
    };
  }

  const index = await buildSupabaseActivationIndex();
  try {
    const pending = admitStudentForPortalActivation(input, index);
    const studentId = `stu-${studentSlug(pending.studentNumber)}`;

    await ensureStudentRow({
      studentId,
      fullName: pending.fullName,
      email: pending.email,
      phone: pending.phone,
      programId: pending.programId,
    });

    const persisted = await persistStudentPortalActivation({ studentId, pending });
    if (!persisted.ok) {
      return { ok: false, message: persisted.message };
    }

    return {
      ok: true,
      message: `Activation credentials created for ${pending.fullName}.`,
      pending,
      studentId,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Registration failed.",
    };
  }
}
