"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Clock,
  Inbox,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { getAdminAnalytics } from "@/services/portal/admin/analytics";
import type { AdminAnalyticsSummary, InquiryStatus } from "@/lib/supabase/types";
import { INQUIRY_STATUS_LABELS } from "@/lib/supabase/types";
import { StatCard } from "@/components/portal/dashboard/StatCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { AppPageHero } from "@/components/ui/AppPageHero";
import { Button } from "@/components/ui/Button";
import { DataCard } from "@/components/ui/DataCard";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";
import { StatusBreakdown } from "@/components/ui/StatusBreakdown";
import { TintBarChart } from "@/components/ui/TintBarChart";
import { cn } from "@/lib/utils";

function inquiryTone(status: InquiryStatus): "success" | "warning" | "danger" | "neutral" | "info" {
  if (status === "resolved" || status === "closed") return "success";
  if (status === "in_progress") return "info";
  return "warning";
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const summary = await getAdminAnalytics();
    setData(summary);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <div className="-mx-4 -mt-6 mb-6 sm:-mx-6 lg:-mx-8">
        <AppPageHero
          eyebrow="Analytics"
          title="Inquiries & performance"
          description="Track incoming customer inquiries, popular programmes, order statuses, and system health."
          actions={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={refreshing}
              onClick={() => void load(true)}
            >
              <RefreshCw className={cn("mr-1.5 h-4 w-4", refreshing && "animate-spin")} aria-hidden />
              Refresh
            </Button>
          }
        />
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {data ? (
          <p
            className={cn(
              "rounded-lg border px-4 py-2.5 text-xs font-medium",
              data.dataSource === "supabase"
                ? "border-accent-green/30 bg-accent-green-soft text-accent-green"
                : "border-amber-200 bg-amber-50 text-amber-800",
            )}
            role="status"
          >
            {data.dataSource === "supabase"
              ? "Live data from Supabase"
              : "Demo data — add Supabase credentials in .env.local to connect your backend (see .env.example)"}
          </p>
        ) : null}

        {loading || !data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl data-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total inquiries"
                value={String(data.metrics.totalInquiries)}
                hint={`${data.metrics.newInquiriesToday} received today`}
                Icon={Inbox}
              />
              <StatCard
                label="Open inquiries"
                value={String(data.metrics.openInquiries)}
                hint="Awaiting staff response"
                Icon={Clock}
                tone={data.metrics.openInquiries > 5 ? "danger" : "default"}
              />
              <StatCard
                label="Total orders"
                value={String(data.metrics.totalOrders)}
                hint={`${data.metrics.orderCompletionRate}% completion rate`}
                Icon={ShoppingCart}
                tone="success"
              />
              <StatCard
                label="Avg response time"
                value={data.metrics.avgResponseHours > 0 ? `${data.metrics.avgResponseHours}h` : "—"}
                hint="Inquiry resolution average"
                Icon={TrendingUp}
                tone={data.metrics.avgResponseHours <= 24 ? "success" : "default"}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <DataCard title="Inquiry volume (7 days)">
                <TintBarChart
                  caption="Daily incoming inquiries"
                  items={data.inquiryTrend.map((d) => ({
                    label: d.label,
                    value: d.count,
                  }))}
                />
              </DataCard>

              <DataCard title="Order status breakdown">
                <StatusBreakdown
                  caption="Application & fee orders by status"
                  items={data.orderStatusBreakdown}
                />
              </DataCard>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              <DataCard title="Popular programmes" className="lg:col-span-3">
                <TintBarChart
                  caption="Combined inquiries + orders per programme"
                  items={data.popularProducts.map((p) => ({
                    label: p.title,
                    value: p.inquiryCount + p.orderCount,
                    formattedValue: `${p.inquiryCount + p.orderCount} (${p.inquiryCount} inq · ${p.orderCount} ord)`,
                  }))}
                />
              </DataCard>

              <DataCard title="System performance" className="lg:col-span-2">
                <ul className="space-y-3" role="list">
                  {data.systemPerformance.map((metric) => (
                    <li
                      key={metric.label}
                      className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface/50 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                          {metric.label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{metric.hint}</p>
                      </div>
                      <p
                        className={cn(
                          "shrink-0 text-lg font-extrabold",
                          metric.tone === "success" && "text-accent-green",
                          metric.tone === "danger" && "text-red-600",
                          (!metric.tone || metric.tone === "default") && "text-primary",
                        )}
                      >
                        {metric.value}
                      </p>
                    </li>
                  ))}
                </ul>
              </DataCard>
            </div>

            <DataCard
              title={
                <span className="flex w-full items-center gap-2">
                  <Inbox className="h-4 w-4 shrink-0" aria-hidden />
                  Recent customer inquiries
                </span>
              }
            >
              {data.recentInquiries.length === 0 ? (
                <p className="text-sm text-muted">No inquiries recorded yet.</p>
              ) : (
                <DataTable caption="Recent customer inquiries">
                  <DataTableHead>
                    <tr>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Programme</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Received</th>
                    </tr>
                  </DataTableHead>
                  <DataTableBody>
                    {data.recentInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-surface/60">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-primary">{inq.fullName}</p>
                          <p className="text-xs text-muted">{inq.email}</p>
                        </td>
                        <td className="px-4 py-3 capitalize text-foreground">{inq.category}</td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {inq.productTitle ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={inquiryTone(inq.status)}>
                            {INQUIRY_STATUS_LABELS[inq.status]}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {formatRelativeTime(inq.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </DataTableBody>
                </DataTable>
              )}
            </DataCard>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="data-card flex items-center gap-3 p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-cyan-soft text-primary">
                  <BarChart3 className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Programme interest
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {data.popularProducts[0]?.title ?? "—"}
                  </p>
                  <p className="text-xs text-muted">Most popular this period</p>
                </div>
              </div>
              <div className="data-card flex items-center gap-3 p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green-soft text-accent-green">
                  <Package className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Active catalogue
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {data.popularProducts.length} programmes tracked
                  </p>
                  <p className="text-xs text-muted">Nursing & midwifery offerings</p>
                </div>
              </div>
              <div className="data-card flex items-center gap-3 p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-cyan-soft text-primary">
                  <Activity className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Pipeline health
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {data.metrics.orderCompletionRate}% orders complete
                  </p>
                  <p className="text-xs text-muted">
                    {data.orderStatusBreakdown.find((s) => s.status === "pending")?.count ?? 0}{" "}
                    pending ·{" "}
                    {data.orderStatusBreakdown.find((s) => s.status === "processing")?.count ?? 0}{" "}
                    processing
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
