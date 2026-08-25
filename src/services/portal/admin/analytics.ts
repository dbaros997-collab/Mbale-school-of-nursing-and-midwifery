"use server";

import { buildAnalyticsSummary } from "@/lib/supabase/aggregate-analytics";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getMockInquiries,
  getMockOrders,
  getMockProducts,
} from "@/lib/supabase/mock-analytics";
import type {
  AdminAnalyticsSummary,
  InquiryRow,
  OrderRow,
  ProductRow,
} from "@/lib/supabase/types";

async function fetchFromSupabase(): Promise<AdminAnalyticsSummary> {
  const supabase = createAdminClient();

  const [inquiriesRes, ordersRes, productsRes] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id,full_name,email,category,product_id,status,created_at,resolved_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("orders")
      .select("id,product_id,status,payment_status,created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("products").select("id,title,active").eq("active", true),
  ]);

  if (inquiriesRes.error) throw inquiriesRes.error;
  if (ordersRes.error) throw ordersRes.error;
  if (productsRes.error) throw productsRes.error;

  return buildAnalyticsSummary(
    (inquiriesRes.data ?? []) as InquiryRow[],
    (ordersRes.data ?? []) as OrderRow[],
    (productsRes.data ?? []) as ProductRow[],
    "supabase",
  );
}

function fetchFromMock(): AdminAnalyticsSummary {
  return buildAnalyticsSummary(
    getMockInquiries(),
    getMockOrders(),
    getMockProducts(),
    "mock",
  );
}

/** Admin analytics dashboard — inquiries, popular programmes, order statuses. */
export async function getAdminAnalytics(): Promise<AdminAnalyticsSummary> {
  if (!isSupabaseConfigured()) {
    return fetchFromMock();
  }

  try {
    return await fetchFromSupabase();
  } catch (error) {
    console.error("[getAdminAnalytics] Supabase fetch failed, using mock data:", error);
    return fetchFromMock();
  }
}
