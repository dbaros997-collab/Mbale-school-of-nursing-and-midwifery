import { mockDelay } from "@/lib/mock-delay";
import {
  MOCK_CATALOG,
  MOCK_ENROLLMENTS,
  MOCK_PROFILE,
  MOCK_PROGRAM,
  REGISTRATION_SEMESTER,
  mockRegistration,
  setMockRegistration,
  resetMockRegistration,
} from "@/lib/portal/mock-store";
import { MAX_CREDIT_LOAD, MIN_CREDIT_LOAD } from "@/lib/portal/constants";
import type { CourseUnit, RegistrationStatus, SemesterRegistration } from "@/lib/portal/schema";

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

function unitMap() {
  return Object.fromEntries(MOCK_CATALOG.map((u) => [u.id, u]));
}

function completedUnitIds(studentId: string): Set<string> {
  return new Set(
    MOCK_ENROLLMENTS.filter((e) => e.studentId === studentId && e.status === "completed").map(
      (e) => e.courseUnitId,
    ),
  );
}

function activeUnitIds(studentId: string): Set<string> {
  return new Set(
    MOCK_ENROLLMENTS.filter((e) => e.studentId === studentId && e.status === "active").map(
      (e) => e.courseUnitId,
    ),
  );
}

/** Units offered for the upcoming registration window (semester 4 catalog) */
function offerableUnits(): CourseUnit[] {
  return MOCK_CATALOG.filter((u) => u.semester === 4);
}

function buildEligibility(studentId: string): UnitEligibility[] {
  const map = unitMap();
  const completed = completedUnitIds(studentId);
  // For demo: treat active current-semester units as satisfied prereqs once student is mid-progress
  // Units that need CURRENT semester courses still show as missing until those are completed —
  // except ethics/fund/patho which are completed or we allow ethics as completed path.
  // Realistic: only `completed` counts. Advanced units needing AHN/Pharm will be blocked.
  const satisfied = completed;

  return offerableUnits().map((unit) => {
    const prereqCodes = unit.prerequisiteIds.map((id) => map[id]?.code ?? id);
    const missing = unit.prerequisiteIds.filter((id) => !satisfied.has(id));
    const missingPrereqCodes = missing.map((id) => map[id]?.code ?? id);

    if (activeUnitIds(studentId).has(unit.id)) {
      return {
        unit,
        selectable: false,
        reason: "Already enrolled this year",
        missingPrereqCodes: [],
        prereqCodes,
      };
    }

    if (missing.length > 0) {
      return {
        unit,
        selectable: false,
        reason: `Missing prerequisite(s): ${missingPrereqCodes.join(", ")}`,
        missingPrereqCodes,
        prereqCodes,
      };
    }

    return {
      unit,
      selectable: true,
      reason: null,
      missingPrereqCodes: [],
      prereqCodes,
    };
  });
}

function validateSelection(
  courseUnitIds: string[],
  eligibility: UnitEligibility[],
): { totalCredits: number; errors: string[]; canSubmit: boolean } {
  const eligById = Object.fromEntries(eligibility.map((e) => [e.unit.id, e]));
  const errors: string[] = [];
  let totalCredits = 0;

  for (const id of courseUnitIds) {
    const row = eligById[id];
    if (!row) {
      errors.push("One or more selected units are not in the offer list.");
      continue;
    }
    if (!row.selectable) {
      errors.push(`${row.unit.code}: ${row.reason}`);
    }
    totalCredits += row.unit.credits;
  }

  if (courseUnitIds.length === 0) {
    errors.push("Select at least one unit to register.");
  } else if (totalCredits < MIN_CREDIT_LOAD) {
    errors.push(`Credit load ${totalCredits} is below the minimum of ${MIN_CREDIT_LOAD}.`);
  }
  if (totalCredits > MAX_CREDIT_LOAD) {
    errors.push(`Credit load ${totalCredits} exceeds the maximum of ${MAX_CREDIT_LOAD}.`);
  }

  const locked = mockRegistration.status === "submitted" || mockRegistration.status === "approved";
  if (locked) {
    errors.push("Registration already submitted — await approval.");
  }

  const canSubmit =
    !locked &&
    courseUnitIds.length > 0 &&
    totalCredits >= MIN_CREDIT_LOAD &&
    totalCredits <= MAX_CREDIT_LOAD &&
    courseUnitIds.every((id) => eligById[id]?.selectable);

  return { totalCredits, errors, canSubmit };
}

function bundle(studentId: string): RegistrationBundle {
  const eligibility = buildEligibility(studentId);
  const selectedUnits = mockRegistration.courseUnitIds
    .map((id) => eligibility.find((e) => e.unit.id === id)?.unit)
    .filter(Boolean) as CourseUnit[];

  const { totalCredits, errors, canSubmit } = validateSelection(
    mockRegistration.courseUnitIds,
    eligibility,
  );

  return {
    semesterLabel: REGISTRATION_SEMESTER,
    programTitle: MOCK_PROGRAM.title,
    maxCredits: MAX_CREDIT_LOAD,
    minCredits: MIN_CREDIT_LOAD,
    registration: { ...mockRegistration, totalCredits },
    catalog: eligibility,
    selectedUnits,
    totalCredits,
    validationErrors: errors.filter(
      (e) =>
        // Don't spam empty-selection error while browsing with empty cart unless submitting
        e !== "Select at least one unit to register." || mockRegistration.courseUnitIds.length > 0,
    ),
    canSubmit,
  };
}

/** Ready for GET /api/portal/registration */
export async function getRegistrationBundle(
  studentId = MOCK_PROFILE.id,
): Promise<RegistrationBundle> {
  await mockDelay(280);
  return bundle(studentId);
}

/** Ready for PATCH /api/portal/registration/units */
export async function toggleRegistrationUnit(
  unitId: string,
  studentId = MOCK_PROFILE.id,
): Promise<RegistrationBundle> {
  await mockDelay(180);

  if (mockRegistration.status === "submitted" || mockRegistration.status === "approved") {
    return bundle(studentId);
  }

  const eligibility = buildEligibility(studentId);
  const row = eligibility.find((e) => e.unit.id === unitId);
  if (!row?.selectable) {
    return bundle(studentId);
  }

  const exists = mockRegistration.courseUnitIds.includes(unitId);
  const courseUnitIds = exists
    ? mockRegistration.courseUnitIds.filter((id) => id !== unitId)
    : [...mockRegistration.courseUnitIds, unitId];

  const totalCredits = courseUnitIds.reduce((sum, id) => {
    const u = MOCK_CATALOG.find((c) => c.id === id);
    return sum + (u?.credits ?? 0);
  }, 0);

  setMockRegistration({
    ...mockRegistration,
    courseUnitIds,
    totalCredits,
    status: "draft",
    submittedAt: null,
  });

  return bundle(studentId);
}

/** Ready for POST /api/portal/registration/submit */
export async function submitRegistration(
  studentId = MOCK_PROFILE.id,
): Promise<{ ok: boolean; message: string; bundle: RegistrationBundle }> {
  await mockDelay(500);

  const current = bundle(studentId);
  if (!current.canSubmit) {
    return {
      ok: false,
      message: current.validationErrors[0] ?? "Unable to submit registration.",
      bundle: current,
    };
  }

  setMockRegistration({
    ...mockRegistration,
    totalCredits: current.totalCredits,
    status: "submitted" as RegistrationStatus,
    submittedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message: "Registration submitted for approval. No paperwork required.",
    bundle: bundle(studentId),
  };
}

/** Demo helper — reopen draft after submit */
export async function reopenRegistrationDraft(
  studentId = MOCK_PROFILE.id,
): Promise<RegistrationBundle> {
  await mockDelay(200);
  resetMockRegistration();
  return bundle(studentId);
}
