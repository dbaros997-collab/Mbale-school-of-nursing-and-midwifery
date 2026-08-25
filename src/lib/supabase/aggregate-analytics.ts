import type {
  AdminAnalyticsSummary,
  InquiryRow,
  OrderRow,
  OrderStatus,
  ProductRow,
} from "@/lib/supabase/types";
import { INQUIRY_STATUS_LABELS, ORDER_STATUS_LABELS } from "@/lib/supabase/types";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-UG", { weekday: "short", month: "short", day: "numeric" });
}

function buildInquiryTrend(inquiries: InquiryRow[]): AdminAnalyticsSummary["inquiryTrend"] {
  const days = 7;
  const today = startOfDay(new Date());
  const buckets: AdminAnalyticsSummary["inquiryTrend"] = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);

    const count = inquiries.filter((inq) => {
      const created = new Date(inq.created_at);
      return created >= day && created < next;
    }).length;

    buckets.push({
      date: day.toISOString().slice(0, 10),
      label: formatDayLabel(day),
      count,
    });
  }

  return buckets;
}

function buildOrderStatusBreakdown(orders: OrderRow[]): AdminAnalyticsSummary["orderStatusBreakdown"] {
  const statuses: OrderStatus[] = ["pending", "processing", "completed", "cancelled", "failed"];
  return statuses.map((status) => ({
    status,
    label: ORDER_STATUS_LABELS[status],
    count: orders.filter((o) => o.status === status).length,
  }));
}

function buildPopularProducts(
  products: ProductRow[],
  inquiries: InquiryRow[],
  orders: OrderRow[],
): AdminAnalyticsSummary["popularProducts"] {
  return products
    .map((product) => ({
      productId: product.id,
      title: product.title,
      inquiryCount: inquiries.filter((i) => i.product_id === product.id).length,
      orderCount: orders.filter((o) => o.product_id === product.id).length,
    }))
    .sort((a, b) => b.inquiryCount + b.orderCount - (a.inquiryCount + a.orderCount))
    .slice(0, 6);
}

function computeAvgResponseHours(inquiries: InquiryRow[]): number {
  const resolved = inquiries.filter((i) => i.resolved_at);
  if (resolved.length === 0) return 0;

  const totalHours = resolved.reduce((sum, inq) => {
    const start = new Date(inq.created_at).getTime();
    const end = new Date(inq.resolved_at!).getTime();
    return sum + (end - start) / (1000 * 60 * 60);
  }, 0);

  return Math.round((totalHours / resolved.length) * 10) / 10;
}

export function buildAnalyticsSummary(
  inquiries: InquiryRow[],
  orders: OrderRow[],
  products: ProductRow[],
  dataSource: "supabase" | "mock",
): AdminAnalyticsSummary {
  const todayStart = startOfDay(new Date());
  const newInquiriesToday = inquiries.filter(
    (i) => new Date(i.created_at) >= todayStart,
  ).length;
  const openInquiries = inquiries.filter(
    (i) => i.status === "new" || i.status === "in_progress",
  ).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const orderCompletionRate =
    orders.length === 0 ? 0 : Math.round((completedOrders / orders.length) * 100);

  const productTitleById = new Map(products.map((p) => [p.id, p.title]));

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)
    .map((inq) => ({
      id: inq.id,
      fullName: inq.full_name,
      email: inq.email,
      category: inq.category,
      status: inq.status,
      createdAt: inq.created_at,
      productTitle: inq.product_id ? productTitleById.get(inq.product_id) ?? null : null,
    }));

  const avgResponseHours = computeAvgResponseHours(inquiries);
  const paidOrders = orders.filter((o) => o.payment_status === "paid").length;
  const failedOrders = orders.filter((o) => o.status === "failed").length;

  return {
    metrics: {
      totalInquiries: inquiries.length,
      newInquiriesToday,
      openInquiries,
      totalOrders: orders.length,
      orderCompletionRate,
      avgResponseHours,
    },
    inquiryTrend: buildInquiryTrend(inquiries),
    orderStatusBreakdown: buildOrderStatusBreakdown(orders),
    popularProducts: buildPopularProducts(products, inquiries, orders),
    recentInquiries,
    systemPerformance: [
      {
        label: "Avg inquiry response",
        value: avgResponseHours > 0 ? `${avgResponseHours}h` : "—",
        hint: "Time from receipt to resolution",
        tone: avgResponseHours <= 24 ? "success" : "default",
      },
      {
        label: "Order completion rate",
        value: `${orderCompletionRate}%`,
        hint: `${completedOrders} of ${orders.length} orders completed`,
        tone: orderCompletionRate >= 70 ? "success" : "default",
      },
      {
        label: "Paid orders",
        value: String(paidOrders),
        hint: "Application fees received",
        tone: "success",
      },
      {
        label: "Failed payments",
        value: String(failedOrders),
        hint: "Requires follow-up",
        tone: failedOrders > 0 ? "danger" : "success",
      },
      {
        label: "Open inquiries",
        value: String(openInquiries),
        hint: "New + in progress",
        tone: openInquiries > 5 ? "danger" : "default",
      },
      {
        label: "Active programmes",
        value: String(products.filter((p) => p.active).length),
        hint: "Listed in catalogue",
        tone: "default",
      },
    ],
    dataSource,
  };
}

export { INQUIRY_STATUS_LABELS };
