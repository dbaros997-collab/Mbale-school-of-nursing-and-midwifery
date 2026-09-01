"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  adjustStudentBalance,
  getAdminFeesBundle,
  recordStudentPayment,
  type AdminFeesBundle,
} from "@/services/portal/admin/fees";
import type { PaymentMethod } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";
import { DataCard } from "@/components/ui/DataCard";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

export default function AdminFeesPage() {
  const [data, setData] = useState<AdminFeesBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bank");
  const [reference, setReference] = useState("");
  const [newBalance, setNewBalance] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const bundle = await getAdminFeesBundle();
    setData(bundle);
    if (!studentId && bundle.students[0]) {
      setStudentId(bundle.students[0].id);
      setNewBalance(String(bundle.students[0].feeBalance));
    }
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  function onStudentChange(id: string) {
    setStudentId(id);
    const row = data?.students.find((s) => s.id === id);
    if (row) {
      setNewBalance(String(row.feeBalance));
      if (row.feeBalance > 0) {
        setAmount(String(Math.min(row.feeBalance, 200_000)));
      } else {
        setAmount("");
      }
    }
  }

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await recordStudentPayment({
      studentId,
      amount: Number(amount.replace(/,/g, "")),
      method,
      reference: reference.trim() || undefined,
    });
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok) {
      setReference("");
      const row = result.bundle.students.find((s) => s.id === studentId);
      if (row) {
        setNewBalance(String(row.feeBalance));
        setAmount(row.feeBalance > 0 ? String(Math.min(row.feeBalance, 200_000)) : "");
      }
    }
    setBusy(false);
  }

  async function handleAdjustBalance(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await adjustStudentBalance({
      studentId,
      newBalance: Number(newBalance.replace(/,/g, "")),
    });
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    setBusy(false);
  }

  const selected = data?.students.find((s) => s.id === studentId);
  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="admin-page-eyebrow">Financial ledger</p>
        <h1 className="admin-page-title">Fee payments &amp; balances</h1>
        <p className="admin-page-desc">
          View and record student fee payments, and update account balances in UGX.
        </p>
      </div>

      {flash ? (
        <p
          className={
            flash.ok
              ? "rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
          role="status"
        >
          {flash.text}
        </p>
      ) : null}

      {loading || !data ? (
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl border border-border bg-white" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Total collected · {data.semesterLabel}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-accent-green">
                {formatUgx(data.totalCollected)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Total outstanding
              </p>
              <p className="mt-2 text-2xl font-extrabold text-red-600">
                {formatUgx(data.totalOutstanding)}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <DataCard title="Student balances">
                <DataTable caption="Student fee balances">
                  <DataTableHead>
                    <tr>
                      <th className="font-semibold">Student</th>
                      <th className="font-semibold">Billed</th>
                      <th className="font-semibold">Paid</th>
                      <th className="font-semibold">Balance</th>
                      <th className="font-semibold">Status</th>
                    </tr>
                  </DataTableHead>
                  <DataTableBody>
                      {data.students.map((s) => (
                        <tr
                          key={s.id}
                          className={cn(
                            "cursor-pointer",
                            studentId === s.id && "bg-[var(--tint-sky-100)]",
                          )}
                          onClick={() => onStudentChange(s.id)}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-primary">{s.fullName}</p>
                            <p className="text-xs text-muted">{s.studentNumber}</p>
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {formatUgx(s.feeTotalBilled)}
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {formatUgx(s.feeTotalPaid)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary">
                            {formatUgx(s.feeBalance)}
                          </td>
                          <td className="px-4 py-3">
                            {s.feeBalance > 0 ? (
                              <StatusBadge tone="danger">Due</StatusBadge>
                            ) : (
                              <StatusBadge tone="success">Cleared</StatusBadge>
                            )}
                          </td>
                        </tr>
                      ))}
                  </DataTableBody>
                </DataTable>
              </DataCard>

              <DataCard title="Payment history">
                <ul className="max-h-80 space-y-2 overflow-y-auto">
                  {data.payments.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary">
                          {formatUgx(p.amount)} · {p.studentName}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {PAYMENT_METHOD_LABELS[p.method]} · {p.reference} ·{" "}
                          {new Date(p.paidAt).toLocaleString("en-UG")}
                        </p>
                      </div>
                      <StatusBadge
                        tone={p.status === "completed" ? "success" : "warning"}
                      >
                        {p.status}
                      </StatusBadge>
                    </li>
                  ))}
                </ul>
              </DataCard>
            </div>

            <div className="space-y-6">
              <form
                onSubmit={handleRecordPayment}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Record payment
                </h2>
                {selected ? (
                  <p className="mt-1 text-xs text-muted">
                    Selected: {selected.fullName} · Balance {formatUgx(selected.feeBalance)}
                  </p>
                ) : null}
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-semibold text-muted">
                    Student
                    <select
                      className={cn(inputClass, "mt-1")}
                      value={studentId}
                      onChange={(e) => onStudentChange(e.target.value)}
                      required
                    >
                      {data.students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({formatUgx(s.feeBalance)})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Amount (UGX)
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      inputMode="numeric"
                      required
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Method
                    <select
                      className={cn(inputClass, "mt-1")}
                      value={method}
                      onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    >
                      {(["bank"] as PaymentMethod[]).map(
                        (m) => (
                          <option key={m} value={m}>
                            {PAYMENT_METHOD_LABELS[m]}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Reference (optional)
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Auto-generated if blank"
                    />
                  </label>
                  <Button
                    type="submit"
                    variant="green"
                    className="w-full"
                    disabled={busy || (selected?.feeBalance ?? 0) <= 0}
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Record payment
                  </Button>
                </div>
              </form>

              <form
                onSubmit={handleAdjustBalance}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Update balance
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Manually set the outstanding balance (e.g. after waiver or correction).
                </p>
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-semibold text-muted">
                    New balance (UGX)
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      inputMode="numeric"
                      required
                    />
                  </label>
                  <Button type="submit" variant="ghost" className="w-full" disabled={busy}>
                    Update account balance
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
