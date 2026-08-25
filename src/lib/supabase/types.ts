/** Row shapes for Supabase admin analytics tables. */

export type InquiryStatus = "new" | "in_progress" | "resolved" | "closed";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "failed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type ProductRow = {
  id: string;
  title: string;
  category: string;
  level: string;
  active: boolean;
  created_at: string;
};

export type InquiryRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  category: string;
  product_id: string | null;
  message: string;
  status: InquiryStatus;
  source: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type OrderRow = {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  product_id: string | null;
  amount_ugx: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type AdminAnalyticsSummary = {
  metrics: {
    totalInquiries: number;
    newInquiriesToday: number;
    openInquiries: number;
    totalOrders: number;
    orderCompletionRate: number;
    avgResponseHours: number;
  };
  inquiryTrend: { date: string; label: string; count: number }[];
  orderStatusBreakdown: { status: OrderStatus; label: string; count: number }[];
  popularProducts: {
    productId: string;
    title: string;
    inquiryCount: number;
    orderCount: number;
  }[];
  recentInquiries: {
    id: string;
    fullName: string;
    email: string;
    category: string;
    status: InquiryStatus;
    createdAt: string;
    productTitle: string | null;
  }[];
  systemPerformance: {
    label: string;
    value: string;
    hint: string;
    tone?: "default" | "success" | "danger";
  }[];
  dataSource: "supabase" | "mock";
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
  failed: "Failed",
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};
