import { MAX_CREDIT_LOAD, MIN_CREDIT_LOAD } from "@/lib/portal/constants";
import type { CourseUnit, SemesterRegistration } from "@/lib/portal/schema";

export type UnitEligibility = {
  unit: CourseUnit;
  selectable: boolean;
  reason: string | null;
  missingPrereqCodes: string[];
  prereqCodes: string[];
};

export type RegistrationBundle = {
  semesterLabel: string;
  programTitle: string;
  maxCredits: number;
  minCredits: number;
  registration: SemesterRegistration;
  catalog: UnitEligibility[];
  selectedUnits: CourseUnit[];
  totalCredits: number;
  validationErrors: string[];
  canSubmit: boolean;
};

const emptyRegistration = (studentId: string): SemesterRegistration => ({
  id: `reg-empty-${studentId}`,
  studentId,
  semesterLabel: "—",
  courseUnitIds: [],
  totalCredits: 0,
  status: "draft",
  submittedAt: null,
});

function emptyBundle(studentId = "unknown"): RegistrationBundle {
  return {
    semesterLabel: "—",
    programTitle: "—",
    maxCredits: MAX_CREDIT_LOAD,
    minCredits: MIN_CREDIT_LOAD,
    registration: emptyRegistration(studentId),
    catalog: [],
    selectedUnits: [],
    totalCredits: 0,
    validationErrors: ["Course offerings are not published yet."],
    canSubmit: false,
  };
}

export async function getRegistrationBundle(studentId?: string | null): Promise<RegistrationBundle> {
  return emptyBundle(studentId?.trim() || "unknown");
}

export async function toggleRegistrationUnit(
  _unitId: string,
  studentId?: string,
): Promise<{ ok: boolean; message: string; bundle: RegistrationBundle }> {
  return {
    ok: false,
    message: "Registration is closed until course offerings are published.",
    bundle: await getRegistrationBundle(studentId),
  };
}

export async function submitRegistration(
  studentId?: string,
): Promise<{ ok: boolean; message: string; bundle: RegistrationBundle }> {
  return {
    ok: false,
    message: "Semester registration opens once course offerings are published in the academic system.",
    bundle: await getRegistrationBundle(studentId),
  };
}

export async function reopenRegistrationDraft(
  studentId?: string,
): Promise<RegistrationBundle> {
  return getRegistrationBundle(studentId);
}
