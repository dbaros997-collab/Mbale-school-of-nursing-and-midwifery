"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  approveStudentRegistration,
  getAdminStudentsBundle,
  type AdminStudentRow,
  type AdminStudentsBundle,
} from "@/services/portal/admin/students";
import { formatUgx } from "@/lib/portal/constants";
import { AccountStatusBadge, StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "pending_approval" | "active" | "inactive";

export default function AdminStudentsPage() {
  const [data, setData] = useState<AdminStudentsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<AdminStudentRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const bundle = await getAdminStudentsBundle();
    setData(bundle);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.students.filter((s) => {
      if (filter !== "all" && s.accountStatus !== filter) return false;
      if (!q) return true;
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.studentNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [data, query, filter]);

  async function handleApprove(studentId: string) {
    setBusyId(studentId);
    setFlash(null);
    const result = await approveStudentRegistration(studentId);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok && selected?.id === studentId) {
      const updated = result.bundle.students.find((s) => s.id === studentId) ?? null;
      setSelected(updated);
    }
    setBusyId(null);
  }

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending_approval", label: "Pending" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          Student records
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
          Registered students
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          View profiles, check fee statuses, and approve new account registrations.
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, number, or email…"
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-ring",
                filter === tab.id
                  ? "bg-primary text-white"
                  : "bg-white text-muted border border-border hover:bg-surface",
              )}
            >
              {tab.label}
              {tab.id === "pending_approval" && data
                ? ` (${data.pendingCount})`
                : ""}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="h-80 animate-pulse rounded-xl border border-border bg-white" />
      ) : (
        <DataTable caption="Student registry">
          <DataTableHead>
            <tr>
              <th className="font-semibold">Student</th>
              <th className="font-semibold">Program</th>
              <th className="font-semibold">Account</th>
              <th className="font-semibold">Fee status</th>
              <th className="font-semibold">Units</th>
              <th className="font-semibold">Actions</th>
            </tr>
          </DataTableHead>
          <DataTableBody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted">
                      No students match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-primary">{s.fullName}</p>
                        <p className="text-xs text-muted">{s.studentNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-muted">{s.programCode}</td>
                      <td className="px-4 py-3">
                        <AccountStatusBadge status={s.accountStatus} />
                      </td>
                      <td className="px-4 py-3">
                        {s.feeBalance > 0 ? (
                          <div>
                            <StatusBadge tone="danger">Balance due</StatusBadge>
                            <p className="mt-1 text-xs text-muted">{formatUgx(s.feeBalance)}</p>
                          </div>
                        ) : (
                          <StatusBadge tone="success">Cleared</StatusBadge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">{s.enrolledUnits}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelected(s)}
                          >
                            View
                          </Button>
                          {s.accountStatus === "pending_approval" ? (
                            <Button
                              type="button"
                              variant="green"
                              size="sm"
                              disabled={busyId === s.id}
                              onClick={() => void handleApprove(s.id)}
                            >
                              {busyId === s.id ? "Approving…" : "Approve"}
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
          </DataTableBody>
        </DataTable>
      )}

      {selected ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-primary-dark/40 p-4 sm:items-center">
          <div
            className="absolute inset-0"
            aria-hidden
            onClick={() => setSelected(null)}
          />
          <div
            role="dialog"
            aria-modal
            aria-labelledby="student-profile-title"
            className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
                  Student profile
                </p>
                <h2
                  id="student-profile-title"
                  className="mt-1 text-xl font-extrabold text-primary"
                >
                  {selected.fullName}
                </h2>
                <p className="text-sm text-muted">{selected.studentNumber}</p>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-muted hover:bg-surface focus-ring"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Email
                </dt>
                <dd className="mt-0.5 text-primary">{selected.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Phone
                </dt>
                <dd className="mt-0.5 text-primary">{selected.phone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Address
                </dt>
                <dd className="mt-0.5 text-primary">{selected.address}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Program
                </dt>
                <dd className="mt-0.5 text-primary">{selected.programTitle}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Account
                </dt>
                <dd className="mt-1">
                  <AccountStatusBadge status={selected.accountStatus} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Fee billed
                </dt>
                <dd className="mt-0.5 text-primary">{formatUgx(selected.feeTotalBilled)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Fee paid
                </dt>
                <dd className="mt-0.5 text-primary">{formatUgx(selected.feeTotalPaid)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Balance
                </dt>
                <dd
                  className={
                    selected.feeBalance > 0
                      ? "mt-0.5 font-semibold text-red-600"
                      : "mt-0.5 font-semibold text-accent-green"
                  }
                >
                  {formatUgx(selected.feeBalance)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  GPA / Units
                </dt>
                <dd className="mt-0.5 text-primary">
                  {selected.cumulativeGpa > 0
                    ? selected.cumulativeGpa.toFixed(2)
                    : "—"}{" "}
                  · {selected.enrolledUnits} units
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {selected.accountStatus === "pending_approval" ? (
                <Button
                  type="button"
                  variant="green"
                  disabled={busyId === selected.id}
                  onClick={() => void handleApprove(selected.id)}
                >
                  {busyId === selected.id ? "Approving…" : "Approve registration"}
                </Button>
              ) : null}
              <Button href="/admin/fees" variant="ghost">
                Open fee ledger
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
