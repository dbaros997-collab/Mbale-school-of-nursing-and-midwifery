/** Portal activation credential formats and uniqueness-safe generation. */

export const TEMP_REGISTRATION_PATTERN = /^TMP\/MBSNM\/(\d{4})\/(\d{3})$/;
export const ADMISSION_LETTER_PATTERN = /^ADM-MBSNM-(\d{4})-(\d{3,4})$/;
export const STUDENT_NUMBER_PATTERN = /^MBSNM\/NS\/(\d{4})\/(\d{3})$/;

export type ActivationCredentialIndex = {
  tempRegistrationNumbers: Set<string>;
  admissionLetterRefs: Set<string>;
  studentNumbers: Set<string>;
};

export function normalizeActivationToken(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function isValidTempRegistrationNumber(value: string): boolean {
  return TEMP_REGISTRATION_PATTERN.test(normalizeActivationToken(value));
}

export function isValidAdmissionLetterRef(value: string): boolean {
  return ADMISSION_LETTER_PATTERN.test(normalizeActivationToken(value));
}

export function isValidStudentNumber(value: string): boolean {
  return STUDENT_NUMBER_PATTERN.test(normalizeActivationToken(value));
}

export function formatTempRegistrationNumber(year: number, sequence: number): string {
  if (sequence < 1 || sequence > 999) {
    throw new Error("Temporary registration sequence must be between 1 and 999.");
  }
  return `TMP/MBSNM/${year}/${String(sequence).padStart(3, "0")}`;
}

export function formatAdmissionLetterRef(year: number, sequence: number): string {
  if (sequence < 1 || sequence > 9999) {
    throw new Error("Admission letter sequence must be between 1 and 9999.");
  }
  return `ADM-MBSNM-${year}-${String(sequence).padStart(4, "0")}`;
}

export function formatStudentNumber(year: number, sequence: number): string {
  if (sequence < 1 || sequence > 999) {
    throw new Error("Student number sequence must be between 1 and 999.");
  }
  return `MBSNM/NS/${year}/${String(sequence).padStart(3, "0")}`;
}

function maxSequenceForYear(
  values: Iterable<string>,
  pattern: RegExp,
  yearGroupIndex: number,
  year: number,
): number {
  const targetYear = String(year);
  let max = 0;
  for (const raw of values) {
    const normalized = normalizeActivationToken(raw);
    const match = normalized.match(pattern);
    if (!match) continue;
    if (match[yearGroupIndex] !== targetYear) continue;
    const seq = Number(match[yearGroupIndex + 1]);
    if (Number.isFinite(seq)) max = Math.max(max, seq);
  }
  return max;
}

export function generateUniqueActivationCredentials(
  index: ActivationCredentialIndex,
  year = new Date().getFullYear(),
): {
  tempRegistrationNumber: string;
  admissionLetterRef: string;
  studentNumber: string;
} {
  const tempStart =
    maxSequenceForYear(index.tempRegistrationNumbers, TEMP_REGISTRATION_PATTERN, 1, year) + 1;
  const letterStart =
    maxSequenceForYear(index.admissionLetterRefs, ADMISSION_LETTER_PATTERN, 1, year) + 1;
  const studentStart =
    maxSequenceForYear(index.studentNumbers, STUDENT_NUMBER_PATTERN, 1, year) + 1;

  let sequence = Math.max(tempStart, studentStart, 1);
  let letterSequence = Math.max(letterStart, 1000);

  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const tempRegistrationNumber = formatTempRegistrationNumber(year, sequence);
    const admissionLetterRef = formatAdmissionLetterRef(year, letterSequence);
    const studentNumber = formatStudentNumber(year, sequence);

    const tempKey = normalizeActivationToken(tempRegistrationNumber);
    const letterKey = normalizeActivationToken(admissionLetterRef);
    const studentKey = normalizeActivationToken(studentNumber);

    if (
      !index.tempRegistrationNumbers.has(tempKey) &&
      !index.admissionLetterRefs.has(letterKey) &&
      !index.studentNumbers.has(studentKey)
    ) {
      return { tempRegistrationNumber, admissionLetterRef, studentNumber };
    }

    sequence += 1;
    letterSequence += 1;
  }

  throw new Error(
    "Could not allocate unique activation credentials — registry may be exhausted for this year.",
  );
}

export type ActivationIntegrityIssue = {
  code:
    | "duplicate_temp_registration"
    | "duplicate_admission_letter"
    | "duplicate_student_number"
    | "invalid_temp_format"
    | "invalid_admission_format"
    | "invalid_student_number_format";
  message: string;
  value?: string;
};

export function validateActivationCredentialIndex(
  index: ActivationCredentialIndex,
): ActivationIntegrityIssue[] {
  const issues: ActivationIntegrityIssue[] = [];

  const assertUnique = (
    values: Set<string>,
    code: ActivationIntegrityIssue["code"],
    label: string,
  ) => {
    const seen = new Map<string, number>();
    for (const value of values) {
      const count = (seen.get(value) ?? 0) + 1;
      seen.set(value, count);
      if (count === 2) {
        issues.push({
          code,
          message: `Duplicate ${label}: ${value}`,
          value,
        });
      }
    }
  };

  assertUnique(index.tempRegistrationNumbers, "duplicate_temp_registration", "temporary registration number");
  assertUnique(index.admissionLetterRefs, "duplicate_admission_letter", "admission letter reference");
  assertUnique(index.studentNumbers, "duplicate_student_number", "student number");

  for (const temp of index.tempRegistrationNumbers) {
    if (!isValidTempRegistrationNumber(temp)) {
      issues.push({
        code: "invalid_temp_format",
        message: `Invalid temporary registration format: ${temp}`,
        value: temp,
      });
    }
  }
  for (const letter of index.admissionLetterRefs) {
    if (!isValidAdmissionLetterRef(letter)) {
      issues.push({
        code: "invalid_admission_format",
        message: `Invalid admission letter reference format: ${letter}`,
        value: letter,
      });
    }
  }
  for (const studentNo of index.studentNumbers) {
    if (!isValidStudentNumber(studentNo)) {
      issues.push({
        code: "invalid_student_number_format",
        message: `Invalid student number format: ${studentNo}`,
        value: studentNo,
      });
    }
  }

  return issues;
}
