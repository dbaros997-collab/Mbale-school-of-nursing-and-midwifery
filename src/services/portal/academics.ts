import {
  MOCK_CATALOG,
  MOCK_GRADES,
  MOCK_PROFILE,
  MOCK_PROGRAM,
} from "@/lib/portal/mock-store";
import type { Grade, TranscriptEntry } from "@/lib/portal/schema";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type AcademicsBundle = {
  studentName: string;
  studentNumber: string;
  programTitle: string;
  semesterGpa: number;
  cumulativeGpa: number;
  creditsCompleted: number;
  creditsRequired: number;
  progressPercent: number;
  grades: (Grade & { code: string; title: string; credits: number })[];
  transcript: TranscriptEntry[];
};

/** Ready for GET /api/portal/academics */
export async function getAcademicsBundle(
  studentId = MOCK_PROFILE.id,
): Promise<AcademicsBundle> {
  await delay(280);
  const catalog = Object.fromEntries(MOCK_CATALOG.map((u) => [u.id, u]));

  const grades = MOCK_GRADES.filter((g) => g.studentId === studentId).map((g) => {
    const unit = catalog[g.courseUnitId];
    return {
      ...g,
      code: unit?.code ?? "—",
      title: unit?.title ?? "Unit",
      credits: unit?.credits ?? 0,
    };
  });

  const transcript: TranscriptEntry[] = grades.map((g) => ({
    courseUnitId: g.courseUnitId,
    code: g.code,
    title: g.title,
    credits: g.credits,
    letterGrade: g.letterGrade,
    gpaPoints: g.gpaPoints,
    semesterLabel: g.semesterLabel,
  }));

  const creditsCompleted = MOCK_PROFILE.creditsCompleted;
  const creditsRequired = MOCK_PROFILE.creditsRequired;

  return {
    studentName: MOCK_PROFILE.fullName,
    studentNumber: MOCK_PROFILE.studentNumber,
    programTitle: MOCK_PROGRAM.title,
    semesterGpa: MOCK_PROFILE.semesterGpa,
    cumulativeGpa: MOCK_PROFILE.cumulativeGpa,
    creditsCompleted,
    creditsRequired,
    progressPercent: Math.round((creditsCompleted / creditsRequired) * 100),
    grades,
    transcript,
  };
}

/** Mock transcript download */
export async function downloadTranscript(): Promise<{
  ok: boolean;
  fileName?: string;
  blob?: Blob;
  message: string;
}> {
  await delay(300);
  const data = await getAcademicsBundle();
  const lines = [
    "MBSNM Official Academic Transcript (Mock)",
    "=========================================",
    `Student: ${data.studentName}`,
    `ID: ${data.studentNumber}`,
    `Program: ${data.programTitle}`,
    `Cumulative GPA: ${data.cumulativeGpa.toFixed(2)}`,
    "",
    ...data.transcript.map(
      (t) =>
        `${t.semesterLabel} | ${t.code} | ${t.title} | ${t.credits}cr | ${t.letterGrade} (${t.gpaPoints})`,
    ),
    "",
    "This is a simulated transcript for demonstration purposes.",
  ];
  return {
    ok: true,
    fileName: `MBSNM-Transcript-${data.studentNumber.replace(/\//g, "-")}.txt`,
    blob: new Blob([lines.join("\n")], { type: "text/plain" }),
    message: "Transcript ready.",
  };
}
