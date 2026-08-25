import { programs } from "@/lib/data";
import type { AcademicResults, EligibilityResult, UceGrade } from "@/lib/admissions/types";
import { UCE_GRADES } from "@/lib/admissions/types";

/** Lower rank = better grade (D1 = 1, F9 = 9) */
export function gradeRank(grade: UceGrade): number {
  return UCE_GRADES.indexOf(grade) + 1;
}

export function isPassingGrade(grade: UceGrade): boolean {
  return grade !== "F9";
}

function asUceGrade(grade: string): UceGrade | null {
  return UCE_GRADES.includes(grade as UceGrade) ? (grade as UceGrade) : null;
}

function meetsMinimumFromString(grade: string, maxRank: number): boolean {
  const parsed = asUceGrade(grade);
  if (!parsed) return false;
  return gradeRank(parsed) <= maxRank;
}

function isPassingFromString(grade: string): boolean {
  const parsed = asUceGrade(grade);
  return parsed !== null && isPassingGrade(parsed);
}

export type ProgramPathway = "direct_diploma" | "certificate" | "extension";

export function getProgramPathway(programId: string): ProgramPathway {
  if (programId.includes("extension")) return "extension";
  if (programId.includes("certificate")) return "certificate";
  return "direct_diploma";
}

export function getProgramTitle(programId: string): string {
  return programs.find((p) => p.id === programId)?.title ?? programId;
}

/**
 * Institutional minimum criteria for MBSNM nursing & midwifery programmes.
 * - Certificate: passes (P8 or better) in English, Mathematics, and Biology
 * - Direct diploma: P7 or better in key subjects + at least 5 total UCE passes
 * - Extension: certificate credentials flagged for manual document review
 */
export function evaluateEligibility(input: {
  programId: string;
  educationLevel: string;
  academicResults: AcademicResults;
}): EligibilityResult {
  const pathway = getProgramPathway(input.programId);
  const { academicResults, educationLevel } = input;
  const reasons: string[] = [];

  if (pathway === "extension") {
    if (educationLevel !== "Certificate (for extension)") {
      reasons.push(
        "Extension programmes require a valid Certificate in Nursing or Midwifery as your highest qualification.",
      );
    }
    if (!academicResults.certificateLicenseRef.trim()) {
      reasons.push(
        "Enter your practicing license or certificate registration reference for verification.",
      );
    }

    if (reasons.length) {
      return {
        status: "not_qualified",
        qualified: false,
        summary: "Your profile does not meet the extension programme entry requirements.",
        reasons,
      };
    }

    return {
      status: "manual_review",
      qualified: false,
      summary:
        "Certificate credentials submitted — automated pre-check passed. Admissions will verify your license and clinical experience.",
      reasons: [
        "Extension applicants require manual verification of certificate and practicing license documents.",
      ],
    };
  }

  const { englishGrade, mathematicsGrade, biologyGrade, totalPasses, uceIndexNumber } =
    academicResults;

  if (!uceIndexNumber.trim()) {
    reasons.push("Enter your UCE index number.");
  }

  const keySubjects: { label: string; grade: string }[] = [
    { label: "English", grade: englishGrade },
    { label: "Mathematics", grade: mathematicsGrade },
    { label: "Biology", grade: biologyGrade },
  ];

  for (const subject of keySubjects) {
    if (!subject.grade) {
      reasons.push(`Select your UCE grade for ${subject.label}.`);
    } else if (!isPassingFromString(subject.grade)) {
      reasons.push(`${subject.label}: F9 is not a pass grade.`);
    } else if (!asUceGrade(subject.grade)) {
      reasons.push(`${subject.label}: select a valid UCE grade.`);
    }
  }

  if (reasons.length) {
    return {
      status: "not_qualified",
      qualified: false,
      summary: "Some academic details are missing or do not meet minimum pass requirements.",
      reasons,
    };
  }

  if (pathway === "certificate") {
    const failed = keySubjects.filter(
      (s) => s.grade && !meetsMinimumFromString(s.grade, 8),
    );
    if (failed.length) {
      return {
        status: "not_qualified",
        qualified: false,
        summary: "Your UCE grades do not meet the minimum requirements for this certificate programme.",
        reasons: failed.map(
          (s) => `${s.label} requires at least a pass (P8 or better). You entered ${s.grade}.`,
        ),
      };
    }

    return {
      status: "qualified",
      qualified: true,
      summary: "You meet the minimum UCE requirements for your selected certificate programme.",
      reasons: [
        "Passes in English, Mathematics, and Biology confirmed against certificate entry criteria.",
      ],
    };
  }

  // Direct diploma
  const minKeyRank = 7; // P7 or better in key subjects
  const weakSubjects = keySubjects.filter(
    (s) => s.grade && !meetsMinimumFromString(s.grade, minKeyRank),
  );
  if (weakSubjects.length) {
    return {
      status: "not_qualified",
      qualified: false,
      summary: "Your UCE grades do not meet the minimum requirements for direct diploma entry.",
      reasons: weakSubjects.map(
        (s) =>
          `${s.label} requires P7 or better for direct diploma programmes. You entered ${s.grade}.`,
      ),
    };
  }

  const passes = Number(totalPasses);
  if (!Number.isFinite(passes) || passes < 5) {
    return {
      status: "not_qualified",
      qualified: false,
      summary: "Direct diploma programmes require at least five UCE passes.",
      reasons: [
        passes > 0
          ? `You reported ${passes} pass(es); at least 5 are required.`
          : "Enter your total number of UCE passes (minimum 5).",
      ],
    };
  }

  const allKeyPass = keySubjects.every((s) => meetsMinimumFromString(s.grade, 7));
  if (!allKeyPass) {
    return {
      status: "not_qualified",
      qualified: false,
      summary: "Key subject grades fall below the direct diploma threshold.",
      reasons: ["English, Mathematics, and Biology each require P7 or better."],
    };
  }

  return {
    status: "qualified",
    qualified: true,
    summary: "You meet the automated eligibility criteria for your selected diploma programme.",
    reasons: [
      "Minimum P7 in English, Mathematics, and Biology confirmed.",
      `Total UCE passes (${passes}) meets the minimum of 5.`,
    ],
  };
}
