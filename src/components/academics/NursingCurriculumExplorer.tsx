"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, GraduationCap, Stethoscope } from "lucide-react";
import {
  isNursingCurriculumProgramId,
  nursingCurriculumProgramList,
  type NursingCurriculumCourse,
} from "@/lib/nursing-curriculum";
import { cn } from "@/lib/utils";

const defaultProgramId = nursingCurriculumProgramList[0]?.id ?? "diploma-nursing-direct";

const categoryStyles: Record<NursingCurriculumCourse["category"], string> = {
  Theory: "bg-accent-cyan-soft text-primary",
  Clinical: "bg-accent-green-soft text-accent-green",
  Professional: "bg-accent-gold-soft text-primary",
};

function CourseTable({ courses }: { courses: NursingCurriculumCourse[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted">
            <th className="py-2 pr-4" scope="col">
              Code
            </th>
            <th className="py-2 pr-4" scope="col">
              Course unit
            </th>
            <th className="py-2" scope="col">
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.code} className="border-b border-border/70 last:border-0">
              <td className="py-3 pr-4 font-mono text-xs font-semibold text-muted">{course.code}</td>
              <td className="py-3 pr-4 font-semibold text-primary">{course.title}</td>
              <td className="py-3">
                <span
                  className={cn(
                    "inline-block rounded-md px-2 py-0.5 text-xs font-bold",
                    categoryStyles[course.category],
                  )}
                >
                  {course.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NursingCurriculumExplorer() {
  const [activeProgramId, setActiveProgramId] = useState(defaultProgramId);

  const selectProgram = useCallback((programId: string) => {
    if (!isNursingCurriculumProgramId(programId)) return;
    setActiveProgramId(programId);
    window.history.replaceState(null, "", `#${programId}`);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && isNursingCurriculumProgramId(hash)) {
        setActiveProgramId(hash);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const active =
    nursingCurriculumProgramList.find((entry) => entry.id === activeProgramId) ??
    nursingCurriculumProgramList[0];

  if (!active) return null;

  const totalSemesters = active.curriculum.years.reduce(
    (count, year) => count + year.semesters.length,
    0,
  );

  return (
    <div className="mt-10 space-y-8">
      <div
        role="tablist"
        aria-label="Nursing programme curricula"
        className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
      >
        {nursingCurriculumProgramList.map((program) => {
          const selected = program.id === activeProgramId;
          return (
            <button
              key={program.id}
              type="button"
              role="tab"
              id={`curriculum-tab-${program.id}`}
              aria-selected={selected}
              aria-controls={`curriculum-panel-${program.id}`}
              onClick={() => selectProgram(program.id)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition focus-ring sm:min-w-[220px] sm:flex-1",
                selected
                  ? "border-primary bg-primary text-white shadow-md"
                  : "border-border bg-panel text-primary hover:border-primary/40",
              )}
            >
              <span className="block text-sm font-bold leading-snug">{program.title}</span>
              <span
                className={cn(
                  "mt-1 block text-xs font-semibold",
                  selected ? "text-white/85" : "text-muted",
                )}
              >
                {program.level} · {program.duration} · {totalSemestersFor(program.id)} semesters
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`curriculum-panel-${active.id}`}
        aria-labelledby={`curriculum-tab-${active.id}`}
        className="rounded-3xl content-panel p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl accent-chip-sky">
            <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-extrabold text-primary sm:text-2xl">{active.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {active.level} · {active.duration} · {totalSemesters} semesters · course units by year
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-primary">{active.curriculum.intro}</p>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {active.curriculum.years.map((year) => (
            <section key={year.title} aria-labelledby={`${active.id}-${year.title}`}>
              <h4
                id={`${active.id}-${year.title}`}
                className="flex items-center gap-2 text-lg font-bold text-primary"
              >
                <BookOpen className="h-5 w-5 text-accent-green" aria-hidden />
                {year.title}
              </h4>
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                {year.semesters.map((semester) => (
                  <article
                    key={semester.id}
                    className="rounded-2xl border border-border bg-surface/60 p-4 sm:p-5"
                  >
                    <h5 className="flex items-center gap-2 text-base font-bold text-primary">
                      <Stethoscope className="h-4 w-4 text-accent-cyan" aria-hidden />
                      {semester.title}
                      <span className="text-xs font-semibold text-muted">
                        ({semester.courses.length} units)
                      </span>
                    </h5>
                    <div className="mt-3">
                      <CourseTable courses={semester.courses} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function totalSemestersFor(programId: string): number {
  const entry = nursingCurriculumProgramList.find((p) => p.id === programId);
  if (!entry) return 0;
  return entry.curriculum.years.reduce((count, year) => count + year.semesters.length, 0);
}
