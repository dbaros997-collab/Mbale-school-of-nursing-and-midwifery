import { mockDelay } from "@/lib/mock-delay";
import {
  CURRENT_SEMESTER,
  MOCK_ANNOUNCEMENTS,
  MOCK_CATALOG,
  MOCK_MATERIALS,
  MOCK_PROFILE,
  MOCK_TIMETABLE,
  MOCK_UNITS,
  addMockAnnouncement,
  addMockCatalogUnit,
  addMockMaterial,
  addMockTimetableSlot,
  removeMockTimetableSlot,
  updateMockTimetableSlot,
} from "@/lib/portal/mock-store";
import type {
  Announcement,
  CourseMaterial,
  CourseUnit,
  TimetableSlot,
} from "@/lib/portal/schema";
import { WEEK_DAYS, type TimetableSlotView } from "@/services/portal/timetable";

export type AdminContentBundle = {
  semesterLabel: string;
  announcements: Announcement[];
  materials: Array<CourseMaterial & { courseCode: string; courseTitle: string }>;
  timetable: TimetableSlotView[];
  byDay: Record<(typeof WEEK_DAYS)[number], TimetableSlotView[]>;
  catalog: CourseUnit[];
  offerableUnits: CourseUnit[];
};

function unitLookup() {
  return Object.fromEntries(MOCK_CATALOG.map((u) => [u.id, u]));
}

function buildBundle(): AdminContentBundle {
  const units = unitLookup();

  const timetable: TimetableSlotView[] = MOCK_TIMETABLE.map((s) => ({
    ...s,
    courseCode: units[s.courseUnitId]?.code ?? "—",
    courseTitle: units[s.courseUnitId]?.title ?? "Course",
  })).sort((a, b) => a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime));

  const byDay = Object.fromEntries(
    WEEK_DAYS.map((day) => [day, timetable.filter((s) => s.day === day)]),
  ) as Record<(typeof WEEK_DAYS)[number], TimetableSlotView[]>;

  const materials = MOCK_MATERIALS.map((m) => ({
    ...m,
    courseCode: units[m.courseUnitId]?.code ?? "—",
    courseTitle: units[m.courseUnitId]?.title ?? "Course",
  })).sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );

  const announcements = [...MOCK_ANNOUNCEMENTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    semesterLabel: CURRENT_SEMESTER,
    announcements,
    materials,
    timetable,
    byDay,
    catalog: [...MOCK_CATALOG],
    offerableUnits: [...MOCK_UNITS],
  };
}

/** Ready for GET /api/portal/admin/content */
export async function getAdminContentBundle(): Promise<AdminContentBundle> {
  await mockDelay(280);
  return buildBundle();
}

export type PostAnnouncementInput = {
  title: string;
  body: string;
  audience: Announcement["audience"];
};

/** Ready for POST /api/portal/admin/notices */
export async function postAnnouncement(
  input: PostAnnouncementInput,
): Promise<{ ok: boolean; message: string; bundle: AdminContentBundle }> {
  await mockDelay(400);

  const title = input.title.trim();
  const body = input.body.trim();
  if (!title || !body) {
    return {
      ok: false,
      message: "Title and body are required.",
      bundle: buildBundle(),
    };
  }

  addMockAnnouncement({
    id: `ann-${Date.now()}`,
    title,
    body,
    audience: input.audience,
    publishedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message: `Notice “${title}” published to the board.`,
    bundle: buildBundle(),
  };
}

export type UpsertTimetableInput = {
  id?: string;
  day: TimetableSlot["day"];
  startTime: string;
  endTime: string;
  courseUnitId: string;
  venue: string;
};

/** Ready for POST/PATCH /api/portal/admin/timetable */
export async function upsertTimetableSlot(
  input: UpsertTimetableInput,
): Promise<{ ok: boolean; message: string; bundle: AdminContentBundle }> {
  await mockDelay(400);

  if (!input.courseUnitId || !input.venue.trim() || !input.startTime || !input.endTime) {
    return {
      ok: false,
      message: "Course, venue, and times are required.",
      bundle: buildBundle(),
    };
  }
  if (input.endTime <= input.startTime) {
    return {
      ok: false,
      message: "End time must be after start time.",
      bundle: buildBundle(),
    };
  }

  if (input.id) {
    const updated = updateMockTimetableSlot(input.id, {
      day: input.day,
      startTime: input.startTime,
      endTime: input.endTime,
      courseUnitId: input.courseUnitId,
      venue: input.venue.trim(),
    });
    if (!updated) {
      return { ok: false, message: "Timetable slot not found.", bundle: buildBundle() };
    }
    return { ok: true, message: "Timetable slot updated.", bundle: buildBundle() };
  }

  addMockTimetableSlot({
    id: `tt-${Date.now()}`,
    studentId: MOCK_PROFILE.id,
    day: input.day,
    startTime: input.startTime,
    endTime: input.endTime,
    courseUnitId: input.courseUnitId,
    venue: input.venue.trim(),
  });

  return { ok: true, message: "Timetable slot added.", bundle: buildBundle() };
}

/** Ready for DELETE /api/portal/admin/timetable/:id */
export async function deleteTimetableSlot(
  id: string,
): Promise<{ ok: boolean; message: string; bundle: AdminContentBundle }> {
  await mockDelay(280);
  const ok = removeMockTimetableSlot(id);
  return {
    ok,
    message: ok ? "Slot removed from timetable." : "Slot not found.",
    bundle: buildBundle(),
  };
}

export type UploadMaterialInput = {
  courseUnitId: string;
  title: string;
  fileType: CourseMaterial["fileType"];
};

/** Ready for POST /api/portal/admin/materials */
export async function uploadCourseMaterial(
  input: UploadMaterialInput,
): Promise<{ ok: boolean; message: string; bundle: AdminContentBundle }> {
  await mockDelay(500);

  const title = input.title.trim();
  if (!title || !input.courseUnitId) {
    return {
      ok: false,
      message: "Course unit and material title are required.",
      bundle: buildBundle(),
    };
  }

  const unit = MOCK_CATALOG.find((u) => u.id === input.courseUnitId);
  if (!unit) {
    return { ok: false, message: "Course unit not found.", bundle: buildBundle() };
  }

  const slug = title.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  addMockMaterial({
    id: `mat-${Date.now()}`,
    courseUnitId: input.courseUnitId,
    title,
    fileType: input.fileType,
    fileUrl: `/materials/${slug}.${input.fileType}`,
    uploadedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message: `“${title}” uploaded for ${unit.code}.`,
    bundle: buildBundle(),
  };
}

export type NewUnitInput = {
  code: string;
  title: string;
  credits: number;
  semester: number;
};

/** Ready for POST /api/portal/admin/catalog */
export async function addCourseUnit(
  input: NewUnitInput,
): Promise<{ ok: boolean; message: string; bundle: AdminContentBundle }> {
  await mockDelay(450);

  const code = input.code.trim().toUpperCase();
  const title = input.title.trim();
  if (!code || !title) {
    return {
      ok: false,
      message: "Unit code and title are required.",
      bundle: buildBundle(),
    };
  }
  if (!Number.isFinite(input.credits) || input.credits < 1 || input.credits > 8) {
    return {
      ok: false,
      message: "Credits must be between 1 and 8.",
      bundle: buildBundle(),
    };
  }
  if (MOCK_CATALOG.some((u) => u.code.toUpperCase() === code)) {
    return {
      ok: false,
      message: `Unit code ${code} already exists.`,
      bundle: buildBundle(),
    };
  }

  addMockCatalogUnit({
    id: `unit-${Date.now()}`,
    code,
    title,
    credits: Math.round(input.credits),
    semester: input.semester,
    programId: "prog-dn",
    prerequisiteIds: [],
  });

  return {
    ok: true,
    message: `Course unit ${code} added to the catalog.`,
    bundle: buildBundle(),
  };
}
