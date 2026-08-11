"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getRegistrationBundle,
  reopenRegistrationDraft,
  submitRegistration,
  toggleRegistrationUnit,
  type RegistrationBundle,
} from "@/services/portal/registration";
import { UnitCatalog } from "@/components/portal/registration/UnitCatalog";
import { RegistrationCart } from "@/components/portal/registration/RegistrationCart";

export default function RegistrationPage() {
  const [data, setData] = useState<RegistrationBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const bundle = await getRegistrationBundle();
    setData(bundle);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const locked =
    data?.registration.status === "submitted" ||
    data?.registration.status === "approved";

  async function handleToggle(unitId: string) {
    if (locked || busy) return;
    setBusy(true);
    setMessage(null);
    const bundle = await toggleRegistrationUnit(unitId);
    setData(bundle);
    setBusy(false);
  }

  async function handleSubmit() {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const result = await submitRegistration();
    setData(result.bundle);
    setMessage(result.message);
    setBusy(false);
  }

  async function handleReopen() {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const bundle = await reopenRegistrationDraft();
    setData(bundle);
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          Course registration
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
          Semester registration
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Select units for the upcoming semester, meet credit limits, and submit digitally for
          approval — no paper forms required.
        </p>
      </div>

      {loading || !data ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-96 animate-pulse rounded-xl border border-border bg-white" />
          <div className="h-80 animate-pulse rounded-xl border border-border bg-white" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <UnitCatalog
            catalog={data.catalog}
            selectedIds={data.registration.courseUnitIds}
            locked={Boolean(locked)}
            busy={busy}
            onToggle={handleToggle}
          />
          <RegistrationCart
            semesterLabel={data.semesterLabel}
            registration={data.registration}
            selectedUnits={data.selectedUnits}
            totalCredits={data.totalCredits}
            minCredits={data.minCredits}
            maxCredits={data.maxCredits}
            validationErrors={data.validationErrors}
            canSubmit={data.canSubmit}
            busy={busy}
            message={message}
            onSubmit={handleSubmit}
            onReopen={handleReopen}
            onRemove={handleToggle}
          />
        </div>
      )}
    </div>
  );
}
