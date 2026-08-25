import type {
  AdminAnalyticsSummary,
  InquiryRow,
  OrderRow,
  ProductRow,
} from "@/lib/supabase/types";

const PRODUCTS: ProductRow[] = [
  { id: "diploma-nursing-direct", title: "Diploma in Nursing (Direct)", category: "Nursing", level: "Diploma", active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "diploma-nursing-extension", title: "Diploma in Nursing (Extension)", category: "Nursing", level: "Diploma", active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "certificate-nursing", title: "Certificate in Nursing", category: "Nursing", level: "Certificate", active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "diploma-midwifery-direct", title: "Diploma in Midwifery (Direct)", category: "Midwifery", level: "Diploma", active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "diploma-midwifery-extension", title: "Diploma in Midwifery (Extension)", category: "Midwifery", level: "Diploma", active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "certificate-midwifery", title: "Certificate in Midwifery", category: "Midwifery", level: "Certificate", active: true, created_at: "2026-01-01T00:00:00Z" },
];

function daysAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const MOCK_INQUIRIES: InquiryRow[] = [
  { id: "inq-1", full_name: "Grace Namuli", email: "grace.n@example.com", phone: "+256 701 234 567", category: "admissions", product_id: "diploma-nursing-direct", message: "June 2026 intake requirements for direct-entry nursing.", status: "new", source: "contact_form", created_at: daysAgo(2), updated_at: daysAgo(2), resolved_at: null },
  { id: "inq-2", full_name: "James Okello", email: "j.okello@example.com", phone: "+256 772 890 123", category: "admissions", product_id: "certificate-nursing", message: "Can I apply with UCE passes only?", status: "in_progress", source: "contact_form", created_at: daysAgo(24), updated_at: daysAgo(12), resolved_at: null },
  { id: "inq-3", full_name: "Sarah Achieng", email: "s.achieng@example.com", phone: null, category: "general", product_id: null, message: "Do you offer accommodation on campus?", status: "resolved", source: "contact_form", created_at: daysAgo(72), updated_at: daysAgo(48), resolved_at: daysAgo(48) },
  { id: "inq-4", full_name: "Peter Musoke", email: "p.musoke@example.com", phone: "+256 779 111 222", category: "admissions", product_id: "diploma-midwifery-direct", message: "What clinical sites are used for midwifery training?", status: "new", source: "website_chat", created_at: daysAgo(5), updated_at: daysAgo(5), resolved_at: null },
  { id: "inq-5", full_name: "Faith Nabwire", email: "faith.n@example.com", phone: "+256 700 333 444", category: "admissions", product_id: "diploma-nursing-extension", message: "Eligible for extension programme with certificate?", status: "in_progress", source: "contact_form", created_at: daysAgo(48), updated_at: daysAgo(24), resolved_at: null },
  { id: "inq-6", full_name: "David Ssebunya", email: "d.sseb@example.com", phone: null, category: "fees", product_id: "diploma-nursing-direct", message: "Current tuition and functional fees breakdown.", status: "resolved", source: "contact_form", created_at: daysAgo(120), updated_at: daysAgo(96), resolved_at: daysAgo(96) },
  { id: "inq-7", full_name: "Mary Nalubega", email: "mary.n@example.com", phone: "+256 751 555 666", category: "admissions", product_id: "certificate-midwifery", message: "When does the July 2026 intake close?", status: "new", source: "contact_form", created_at: daysAgo(8), updated_at: daysAgo(8), resolved_at: null },
  { id: "inq-8", full_name: "Robert Kato", email: "r.kato@example.com", phone: "+256 782 777 888", category: "general", product_id: null, message: "Can I visit the campus before applying?", status: "closed", source: "contact_form", created_at: daysAgo(240), updated_at: daysAgo(216), resolved_at: daysAgo(216) },
  { id: "inq-9", full_name: "Anita Wanyama", email: "a.wanyama@example.com", phone: "+256 703 999 000", category: "admissions", product_id: "diploma-nursing-direct", message: "Transfer from another nursing school — possible?", status: "resolved", source: "contact_form", created_at: daysAgo(36), updated_at: daysAgo(30), resolved_at: daysAgo(30) },
  { id: "inq-10", full_name: "John Opio", email: "j.opio@example.com", phone: null, category: "admissions", product_id: "diploma-midwifery-extension", message: "Extension programme start date for July intake.", status: "in_progress", source: "contact_form", created_at: daysAgo(18), updated_at: daysAgo(6), resolved_at: null },
];

const MOCK_ORDERS: OrderRow[] = [
  { id: "ord-1", order_reference: "MBSNM-ORD-2026-0142", customer_name: "Grace Namuli", customer_email: "grace.n@example.com", product_id: "diploma-nursing-direct", amount_ugx: 20000, status: "processing", payment_status: "paid", created_at: daysAgo(2), updated_at: daysAgo(2), completed_at: null },
  { id: "ord-2", order_reference: "MBSNM-ORD-2026-0138", customer_name: "James Okello", customer_email: "j.okello@example.com", product_id: "certificate-nursing", amount_ugx: 20000, status: "pending", payment_status: "unpaid", created_at: daysAgo(24), updated_at: daysAgo(24), completed_at: null },
  { id: "ord-3", order_reference: "MBSNM-ORD-2026-0125", customer_name: "Sarah Achieng", customer_email: "s.achieng@example.com", product_id: "diploma-midwifery-direct", amount_ugx: 20000, status: "completed", payment_status: "paid", created_at: daysAgo(96), updated_at: daysAgo(72), completed_at: daysAgo(72) },
  { id: "ord-4", order_reference: "MBSNM-ORD-2026-0119", customer_name: "Peter Musoke", customer_email: "p.musoke@example.com", product_id: "diploma-midwifery-direct", amount_ugx: 20000, status: "processing", payment_status: "paid", created_at: daysAgo(5), updated_at: daysAgo(5), completed_at: null },
  { id: "ord-5", order_reference: "MBSNM-ORD-2026-0104", customer_name: "Faith Nabwire", customer_email: "faith.n@example.com", product_id: "diploma-nursing-extension", amount_ugx: 20000, status: "completed", payment_status: "paid", created_at: daysAgo(144), updated_at: daysAgo(120), completed_at: daysAgo(120) },
  { id: "ord-6", order_reference: "MBSNM-ORD-2026-0098", customer_name: "David Ssebunya", customer_email: "d.sseb@example.com", product_id: "diploma-nursing-direct", amount_ugx: 20000, status: "failed", payment_status: "unpaid", created_at: daysAgo(168), updated_at: daysAgo(168), completed_at: null },
  { id: "ord-7", order_reference: "MBSNM-ORD-2026-0087", customer_name: "Mary Nalubega", customer_email: "mary.n@example.com", product_id: "certificate-midwifery", amount_ugx: 20000, status: "pending", payment_status: "unpaid", created_at: daysAgo(8), updated_at: daysAgo(8), completed_at: null },
  { id: "ord-8", order_reference: "MBSNM-ORD-2026-0076", customer_name: "Robert Kato", customer_email: "r.kato@example.com", product_id: "certificate-nursing", amount_ugx: 20000, status: "cancelled", payment_status: "refunded", created_at: daysAgo(288), updated_at: daysAgo(264), completed_at: null },
  { id: "ord-9", order_reference: "MBSNM-ORD-2026-0065", customer_name: "Anita Wanyama", customer_email: "a.wanyama@example.com", product_id: "diploma-nursing-direct", amount_ugx: 20000, status: "completed", payment_status: "paid", created_at: daysAgo(336), updated_at: daysAgo(312), completed_at: daysAgo(312) },
  { id: "ord-10", order_reference: "MBSNM-ORD-2026-0054", customer_name: "John Opio", customer_email: "j.opio@example.com", product_id: "diploma-midwifery-extension", amount_ugx: 20000, status: "completed", payment_status: "paid", created_at: daysAgo(384), updated_at: daysAgo(360), completed_at: daysAgo(360) },
];

export function getMockInquiries(): InquiryRow[] {
  return MOCK_INQUIRIES.map((row) => ({ ...row }));
}

export function getMockOrders(): OrderRow[] {
  return MOCK_ORDERS.map((row) => ({ ...row }));
}

export function getMockProducts(): ProductRow[] {
  return PRODUCTS.map((row) => ({ ...row }));
}

export { MOCK_INQUIRIES, MOCK_ORDERS, PRODUCTS };
