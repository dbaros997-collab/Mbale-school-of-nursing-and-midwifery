"use client";

import { useState } from "react";
import { ChevronDown, FileUp, Loader2 } from "lucide-react";
import {
  APPLICATION_FEE_UGX,
  applicationIntakes,
  applicationSteps,
  faqs,
  openIntakesLabel,
  programs,
  SCHOOL,
} from "@/lib/data";
import { useSubmitApplication } from "@/hooks/useMockApi";
import { AcademicResultsFields } from "@/components/admissions/AcademicResultsFields";
import { ApplicationPaymentStep } from "@/components/admissions/ApplicationPaymentStep";
import { QualificationOutcome } from "@/components/admissions/QualificationOutcome";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { formatUgx } from "@/lib/portal/constants";
import { getProgramPathway } from "@/services/admissions/eligibility";
import { cn } from "@/lib/utils";

type FormStep = "details" | "payment";

const emptyAcademic = {
  uceIndexNumber: "",
  englishGrade: "",
  mathematicsGrade: "",
  biologyGrade: "",
  totalPasses: "",
  certificateLicenseRef: "",
};

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  intakeId: "",
  programId: "",
  educationLevel: "",
  message: "",
  documentsLabel: "",
  academicResults: emptyAcademic,
};

export default function AdmissionsPage() {
  const {
    payAndVerify,
    paying,
    verifying,
    outcome,
    error,
    paymentError,
    transactionReference,
    paymentConfirmed,
    reset,
    resetPaymentOnly,
  } = useSubmitApplication();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formStep, setFormStep] = useState<FormStep>("details");
  const [form, setForm] = useState(emptyForm);
  const [paymentReference, setPaymentReference] = useState("");
  const [feeAcknowledged, setFeeAcknowledged] = useState(false);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const formLocked = formStep === "payment" || paying || verifying;

  function validateDetails(): boolean {
    const pathway = form.programId ? getProgramPathway(form.programId) : null;

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.gender ||
      !form.dateOfBirth ||
      !form.educationLevel ||
      !form.intakeId ||
      !form.programId ||
      !form.documentsLabel
    ) {
      setDetailsError("Please complete all required fields before proceeding to payment.");
      return false;
    }

    if (pathway === "extension") {
      if (!form.academicResults.certificateLicenseRef.trim()) {
        setDetailsError("Enter your certificate or practicing license reference.");
        return false;
      }
      if (form.educationLevel !== "Certificate (for extension)") {
        setDetailsError('Set "Highest education" to Certificate (for extension) for this programme.');
        return false;
      }
    } else {
      const { uceIndexNumber, englishGrade, mathematicsGrade, biologyGrade, totalPasses } =
        form.academicResults;
      if (!uceIndexNumber.trim() || !englishGrade || !mathematicsGrade || !biologyGrade) {
        setDetailsError("Complete all UCE academic fields before proceeding to payment.");
        return false;
      }
      if (pathway === "direct_diploma") {
        const passes = Number(totalPasses);
        if (!Number.isFinite(passes) || passes < 1) {
          setDetailsError("Enter your total number of UCE passes.");
          return false;
        }
      }
    }

    setDetailsError(null);
    return true;
  }

  function handleProceedToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!validateDetails()) return;
    setFormStep("payment");
  }

  function buildPayload() {
    return {
      ...form,
      paymentConfirmed: false,
      feePolicyAcknowledged: feeAcknowledged,
      paymentMethod: "bank" as const,
      paymentReference,
      transactionReference: transactionReference ?? "",
      sendNotifications,
      notifySms,
    };
  }

  async function handlePayAndVerify() {
    await payAndVerify(buildPayload());
  }

  function handleEditResults() {
    resetPaymentOnly();
    setFeeAcknowledged(false);
    setFormStep("details");
  }

  function handleReset() {
    reset();
    setForm(emptyForm);
    setFormStep("details");
    setPaymentReference("");
    setFeeAcknowledged(false);
    setSendNotifications(true);
    setNotifySms(false);
    setDetailsError(null);
  }

  return (
    <div>
      <PageBanner
        breadcrumb="Admissions"
        title="How to Apply"
        subtitle={`${openIntakesLabel(" & ")} intakes are open. Application fee: ${formatUgx(APPLICATION_FEE_UGX)}. Motto: “${SCHOOL.motto}”.`}
        image="/images/graduates.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How to apply"
            title="Step-by-step application guide"
            description="From program selection to interview — a clear path into MBSNM."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {applicationSteps.map((item, i) => {
              const stepBadge = [
                "bg-primary text-white",
                "bg-brand-green text-white",
                "bg-brand-sky text-primary",
                "bg-brand-yellow text-primary",
              ][i % 4];
              return (
              <li key={item.step} className="rounded-2xl content-panel p-5">
                <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", stepBadge)}>
                  {item.step}
                </span>
                <h3 className="mt-3 font-bold text-primary">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section-green py-14" id="apply">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Online application"
            title="Prospective student form"
            description={`Enter your details and UCE results, pay ${formatUgx(APPLICATION_FEE_UGX)} by bank transfer, and receive instant eligibility feedback.`}
            align="center"
          />

          <p className="mt-6 text-center text-sm text-muted">
            Already applied?{" "}
            <a href="/admissions/track" className="font-semibold text-primary hover:underline">
              Track your application status
            </a>
          </p>

          {outcome ? (
            <QualificationOutcome
              outcome={outcome}
              onEditResults={handleEditResults}
              onStartOver={handleReset}
            />
          ) : (
            <form
              onSubmit={formStep === "details" ? handleProceedToPayment : (e) => e.preventDefault()}
              className="mt-8 space-y-5 rounded-2xl content-panel p-6 sm:p-8"
              noValidate
            >
              <FormProgress
                step={formStep}
                paymentConfirmed={paymentConfirmed}
                verifying={verifying}
              />

              <fieldset
                disabled={formLocked}
                className={cn("space-y-5", formLocked && "opacity-75")}
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Preferred intake" required>
                    <select
                      required
                      className={inputClass}
                      value={form.intakeId}
                      onChange={(e) => setForm({ ...form, intakeId: e.target.value })}
                    >
                      <option value="">Select an intake</option>
                      {applicationIntakes
                        .filter((i) => i.open)
                        .map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.label}
                          </option>
                        ))}
                    </select>
                  </Field>
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
                </div>

                {form.programId ? (
                  <AcademicResultsFields
                    programId={form.programId}
                    educationLevel={form.educationLevel}
                    value={form.academicResults}
                    onChange={(patch) =>
                      setForm({
                        ...form,
                        academicResults: { ...form.academicResults, ...patch },
                      })
                    }
                    disabled={formLocked}
                  />
                ) : null}

                <Field label="Upload academic documents" required>
                  <label
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center transition",
                      !formLocked && "cursor-pointer hover:border-accent-cyan",
                    )}
                  >
                    <FileUp className="h-6 w-6 text-primary" aria-hidden />
                    <span className="mt-2 text-sm font-medium text-primary">
                      {form.documentsLabel || "Click to select PDF/JPG files"}
                    </span>
                    <span className="mt-1 text-xs text-muted">
                      Transcripts, certificates, ID (mock upload)
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      required={!form.documentsLabel}
                      disabled={formLocked}
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
              </fieldset>

              {formStep === "payment" ? (
                <>
                  <div className="rounded-xl border border-border bg-surface/80 p-4 text-sm">
                    <p className="font-bold text-primary">Status notifications</p>
                    <p className="mt-1 text-xs text-muted">
                      After your eligibility check, send a summary to your registered contacts
                      (simulated email / SMS dispatch).
                    </p>
                    <div className="mt-3 space-y-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sendNotifications}
                          onChange={(e) => setSendNotifications(e.target.checked)}
                          disabled={paying || verifying}
                          className="h-4 w-4 rounded border-border text-primary focus-ring"
                        />
                        <span>
                          Auto-send email to{" "}
                          <span className="font-medium text-primary">{form.email || "your email"}</span>
                        </span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={notifySms}
                          onChange={(e) => setNotifySms(e.target.checked)}
                          disabled={paying || verifying || !sendNotifications}
                          className="h-4 w-4 rounded border-border text-primary focus-ring"
                        />
                        <span>
                          Also send SMS to{" "}
                          <span className="font-medium text-primary">{form.phone || "your phone"}</span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <ApplicationPaymentStep
                    feeUgx={APPLICATION_FEE_UGX}
                    paymentReference={paymentReference}
                    onPaymentReferenceChange={setPaymentReference}
                    feeAcknowledged={feeAcknowledged}
                    onFeeAcknowledgedChange={setFeeAcknowledged}
                    paying={paying}
                    verifying={verifying}
                    paymentConfirmed={paymentConfirmed}
                    transactionReference={transactionReference}
                    paymentError={paymentError}
                    onPay={handlePayAndVerify}
                  />
                </>
              ) : null}

              {detailsError ? (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {detailsError}
                </p>
              ) : null}

              {error ? (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                {formStep === "details" ? (
                  <Button type="submit" variant="green" className="w-full sm:w-auto">
                    Proceed to Payment
                  </Button>
                ) : !paymentConfirmed && !verifying ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setFormStep("details");
                        setFeeAcknowledged(false);
                      }}
                      disabled={paying}
                    >
                      Edit details
                    </Button>
                    <Button
                      type="button"
                      variant="green"
                      disabled={paying || !paymentReference.trim() || !feeAcknowledged}
                      onClick={() => void handlePayAndVerify()}
                    >
                      {paying ? (
                        <>
                          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                          Confirming bank transfer…
                        </>
                      ) : (
                        `Confirm ${formatUgx(APPLICATION_FEE_UGX)} payment`
                      )}
                    </Button>
                  </>
                ) : verifying ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Verifying qualifications…
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="section-gold py-14">
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
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-4 text-left focus-ring"
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

function FormProgress({
  step,
  paymentConfirmed,
  verifying,
}: {
  step: FormStep;
  paymentConfirmed: boolean;
  verifying: boolean;
}) {
  const steps = [
    { id: "details", label: "Your details" },
    { id: "payment", label: "Pay fee" },
    { id: "verify", label: "Eligibility" },
  ] as const;

  const activeIndex =
    step === "details" ? 0 : verifying || paymentConfirmed ? 2 : 1;

  return (
    <ol className="flex gap-2 border-b border-border pb-5" aria-label="Application progress">
      {steps.map((s, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <li
            key={s.id}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-center text-xs font-semibold sm:text-sm",
              done && "text-accent-green",
              active && "bg-primary/5 text-primary",
              !done && !active && "text-muted",
            )}
            aria-current={active ? "step" : undefined}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                done && "bg-accent-green text-white",
                active && "bg-primary text-white",
                !done && !active && "bg-border text-muted",
              )}
            >
              {done ? "✓" : index + 1}
            </span>
            {s.label}
          </li>
        );
      })}
    </ol>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-panel px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted";

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
