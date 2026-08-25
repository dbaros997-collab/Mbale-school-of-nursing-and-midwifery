"use client";

import { UCE_GRADES } from "@/lib/admissions/types";
import { getProgramPathway } from "@/services/admissions/eligibility";

type AcademicResultsForm = {
  uceIndexNumber: string;
  englishGrade: string;
  mathematicsGrade: string;
  biologyGrade: string;
  totalPasses: string;
  certificateLicenseRef: string;
};

type AcademicResultsFieldsProps = {
  programId: string;
  educationLevel: string;
  value: AcademicResultsForm;
  onChange: (patch: Partial<AcademicResultsForm>) => void;
  disabled?: boolean;
};

export function AcademicResultsFields({
  programId,
  educationLevel,
  value,
  onChange,
  disabled,
}: AcademicResultsFieldsProps) {
  const pathway = programId ? getProgramPathway(programId) : "direct_diploma";
  const isExtension = pathway === "extension";
  const isDirectDiploma = pathway === "direct_diploma";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
      <div>
        <h3 className="text-sm font-bold text-primary">Academic qualifications</h3>
        <p className="mt-1 text-xs text-muted">
          {isExtension
            ? "Extension programmes require certificate credentials. UCE grades are optional."
            : "Enter your UCE index number and grades. English, Mathematics, and Biology are required for automated eligibility screening."}
        </p>
      </div>

      {isExtension ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">
            Certificate / practicing license reference
            <span className="text-accent-green"> *</span>
          </span>
          <input
            required
            disabled={disabled}
            className={inputClass}
            value={value.certificateLicenseRef}
            onChange={(e) => onChange({ certificateLicenseRef: e.target.value })}
            placeholder="e.g. UNMC/CN/2024/1182"
          />
          {educationLevel !== "Certificate (for extension)" ? (
            <p className="mt-1.5 text-xs text-amber-700">
              Set &ldquo;Highest education&rdquo; to Certificate (for extension) for this programme.
            </p>
          ) : null}
        </label>
      ) : (
        <>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-foreground">
              UCE index number
              <span className="text-accent-green"> *</span>
            </span>
            <input
              required
              disabled={disabled}
              className={inputClass}
              value={value.uceIndexNumber}
              onChange={(e) => onChange({ uceIndexNumber: e.target.value })}
              placeholder="e.g. U1234/001"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <GradeSelect
              label="English"
              required
              disabled={disabled}
              value={value.englishGrade}
              onChange={(englishGrade) => onChange({ englishGrade })}
            />
            <GradeSelect
              label="Mathematics"
              required
              disabled={disabled}
              value={value.mathematicsGrade}
              onChange={(mathematicsGrade) => onChange({ mathematicsGrade })}
            />
            <GradeSelect
              label="Biology"
              required
              disabled={disabled}
              value={value.biologyGrade}
              onChange={(biologyGrade) => onChange({ biologyGrade })}
            />
          </div>

          {isDirectDiploma ? (
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-foreground">
                Total UCE passes
                <span className="text-accent-green"> *</span>
              </span>
              <input
                required
                type="number"
                min={1}
                max={10}
                disabled={disabled}
                className={inputClass}
                value={value.totalPasses}
                onChange={(e) => onChange({ totalPasses: e.target.value })}
                placeholder="Minimum 5 for direct diploma"
              />
              <p className="mt-1 text-xs text-muted">
                Count subjects graded P8 or better (excluding F9).
              </p>
            </label>
          ) : null}
        </>
      )}
    </div>
  );
}

function GradeSelect({
  label,
  required,
  value,
  onChange,
  disabled,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (grade: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="text-accent-green"> *</span> : null}
      </span>
      <select
        required={required}
        disabled={disabled}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Grade</option>
        {UCE_GRADES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted";
