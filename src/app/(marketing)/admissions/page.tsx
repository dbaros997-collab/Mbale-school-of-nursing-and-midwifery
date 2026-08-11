"use client";

import { useState } from "react";
import { ChevronDown, FileUp, CheckCircle2 } from "lucide-react";
import { applicationSteps, faqs, programs, SCHOOL } from "@/lib/data";
import { useSubmitApplication } from "@/hooks/useMockApi";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { cn } from "@/lib/utils";

export default function AdmissionsPage() {
  const { submit, loading, success, error, reset } = useSubmitApplication();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    programId: "",
    educationLevel: "",
    message: "",
    documentsLabel: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit(form);
  }

  return (
    <div>
      <PageBanner
        breadcrumb="Admissions"
        title="How to Apply"
        subtitle={`July 2026 intake is open. Motto: “${SCHOOL.motto}”.`}
        image="/images/graduates.jpg"
      />

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How to apply"
            title="Step-by-step application guide"
            description="From program selection to interview — a clear path into MBSNM."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {applicationSteps.map((item) => (
              <li key={item.step} className="rounded-2xl border border-border bg-surface p-5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-3 font-bold text-primary">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-surface py-14" id="apply">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Online application"
            title="Prospective student form"
            description="Enter your details, select a preferred course, and upload academic documents."
            align="center"
          />

          {success ? (
            <div
              className="mt-8 rounded-2xl border border-accent-green/30 bg-accent-green-soft p-8 text-center"
              role="status"
            >
              <CheckCircle2 className="mx-auto h-10 w-10 text-accent-green" aria-hidden />
              <h3 className="mt-3 text-xl font-bold text-primary">Application received</h3>
              <p className="mt-2 text-sm text-muted">
                Thank you. Our admissions team will review your file and contact you shortly. (Mock submission —
                ready for API integration.)
              </p>
              <Button className="mt-5" variant="ghost" onClick={reset}>
                Submit another
              </Button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-8 space-y-5 rounded-2xl border border-border bg-white p-6 sm:p-8"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    required
                    className={inputClass}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    required
                    type="tel"
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Gender" required>
                  <select
                    required
                    className={inputClass}
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Date of birth" required>
                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  />
                </Field>
                <Field label="Highest education" required>
                  <select
                    required
                    className={inputClass}
                    value={form.educationLevel}
                    onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>UCE</option>
                    <option>UACE</option>
                    <option>Certificate (for extension)</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>

              <Field label="Preferred course" required>
                <select
                  required
                  className={inputClass}
                  value={form.programId}
                  onChange={(e) => setForm({ ...form, programId: e.target.value })}
                >
                  <option value="">Select a program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Upload academic documents" required>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center transition hover:border-accent-cyan">
                  <FileUp className="h-6 w-6 text-primary" aria-hidden />
                  <span className="mt-2 text-sm font-medium text-primary">
                    {form.documentsLabel || "Click to select PDF/JPG files"}
                  </span>
                  <span className="mt-1 text-xs text-muted">Transcripts, certificates, ID (mock upload)</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    required={!form.documentsLabel}
                    onChange={(e) => {
                      const files = e.target.files;
                      setForm({
                        ...form,
                        documentsLabel: files?.length
                          ? `${files.length} file(s) selected`
                          : "",
                      });
                    }}
                  />
                </label>
              </Field>

              <Field label="Additional message">
                <textarea
                  className={cn(inputClass, "min-h-[100px] resize-y")}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </Field>

              {error ? (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              <Button type="submit" variant="green" className="w-full sm:w-auto" disabled={loading}>
                {loading ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Admissions questions"
            description="Tuition, accommodation, and clinical placement essentials."
            align="center"
          />
          <div className="mt-8 space-y-3">
            {faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.question} className="rounded-xl border border-border bg-surface">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left focus-ring rounded-xl"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span className="font-semibold text-primary">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted transition",
                        open && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {open ? (
                    <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="text-accent-green"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
