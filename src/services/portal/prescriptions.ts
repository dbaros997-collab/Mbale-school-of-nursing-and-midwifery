"use server";

import { mockDelay } from "@/lib/mock-delay";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  addMockPharmacyOrder,
  addMockPrescription,
  decrementMedicationStock,
  findMedication,
  getMockMedications,
  getMockPharmacyOrders,
  getMockPrescriptions,
  nextOrderReference,
  updateMockPharmacyOrder,
  updateMockPrescription,
  validateStock,
} from "@/lib/pharmacy/mock-store";
import type {
  Medication,
  PharmacyOrder,
  PrescriptionLineItem,
  PrescriptionRecord,
  PrescriptionsBundle,
  StockValidationResult,
} from "@/lib/pharmacy/types";
import { MOCK_PROFILE } from "@/lib/portal/mock-store";

const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

function mapMedicationRow(row: Record<string, unknown>): Medication {
  return {
    id: row.id as string,
    sku: row.sku as string,
    name: row.name as string,
    strength: row.strength as string,
    form: row.form as Medication["form"],
    stockQuantity: Number(row.stock_quantity),
    reorderLevel: Number(row.reorder_level),
    unitPriceUgx: Number(row.unit_price_ugx),
    requiresPrescription: Boolean(row.requires_prescription),
    active: Boolean(row.active),
  };
}

function buildOrderFromPrescription(
  prescription: PrescriptionRecord,
  medications: Medication[],
): PharmacyOrder {
  const lineItems = prescription.lineItems.map((line) => {
    const med = medications.find((m) => m.id === line.medicationId)!;
    return {
      medicationId: med.id,
      medicationName: `${med.name} ${med.strength}`,
      sku: med.sku,
      quantity: line.quantity,
      unitPriceUgx: med.unitPriceUgx,
      inStock: med.stockQuantity >= line.quantity,
    };
  });
  const totalAmountUgx = lineItems.reduce(
    (sum, l) => sum + l.quantity * l.unitPriceUgx,
    0,
  );
  return {
    id: `po-${Date.now()}`,
    orderReference: nextOrderReference(),
    prescriptionId: prescription.id,
    customerId: prescription.customerId,
    customerName: prescription.customerName,
    status: "validated",
    totalAmountUgx,
    lineItems,
    createdAt: new Date().toISOString(),
    fulfilledAt: null,
  };
}

async function fetchBundleFromSupabase(customerId: string): Promise<PrescriptionsBundle> {
  const supabase = createAdminClient();
  const [medsRes, rxRes, ordRes] = await Promise.all([
    supabase.from("medications").select("*").eq("active", true).order("name"),
    supabase.from("prescriptions").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
    supabase.from("pharmacy_orders").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
  ]);
  if (medsRes.error) throw medsRes.error;
  if (rxRes.error) throw rxRes.error;
  if (ordRes.error) throw ordRes.error;

  return {
    medications: (medsRes.data ?? []).map(mapMedicationRow),
    prescriptions: (rxRes.data ?? []).map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      customerName: row.customer_name,
      fileName: row.file_name,
      fileUrl: row.file_url,
      notes: row.notes ?? "",
      status: row.status,
      lineItems: row.line_items as PrescriptionLineItem[],
      orderId: row.order_id,
      stockValidatedAt: row.stock_validated_at,
      submittedAt: row.submitted_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
    orders: (ordRes.data ?? []).map((row) => ({
      id: row.id,
      orderReference: row.order_reference,
      prescriptionId: row.prescription_id,
      customerId: row.customer_id,
      customerName: row.customer_name,
      status: row.status,
      totalAmountUgx: Number(row.total_amount_ugx),
      lineItems: row.line_items as PharmacyOrder["lineItems"],
      createdAt: row.created_at,
      fulfilledAt: row.fulfilled_at,
    })),
  };
}

function fetchBundleFromMock(customerId: string): PrescriptionsBundle {
  return {
    medications: getMockMedications(),
    prescriptions: getMockPrescriptions(customerId),
    orders: getMockPharmacyOrders(customerId),
  };
}

/** Catalogue + customer prescription/order history. */
export async function getPrescriptionsBundle(
  customerId = MOCK_PROFILE.id,
  customerName = MOCK_PROFILE.fullName,
): Promise<PrescriptionsBundle & { customerName: string }> {
  await mockDelay(200);
  void customerName;
  if (isSupabaseConfigured()) {
    try {
      const bundle = await fetchBundleFromSupabase(customerId);
      return { ...bundle, customerName };
    } catch (error) {
      console.error("[getPrescriptionsBundle] Supabase failed, using mock:", error);
    }
  }
  return { ...fetchBundleFromMock(customerId), customerName };
}

/** Validate cart against live stock levels. */
export async function validatePrescriptionStock(
  lineItems: PrescriptionLineItem[],
): Promise<StockValidationResult> {
  await mockDelay(120);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.rpc("validate_pharmacy_stock", {
        p_line_items: lineItems,
      });
      if (!error && data) {
        return {
          valid: Boolean(data.valid),
          errors: (data.errors ?? []).map((e: { message: string }) => e.message),
          warnings: [],
          lineResults: (data.lineResults ?? []) as StockValidationResult["lineResults"],
        };
      }
    } catch (error) {
      console.error("[validatePrescriptionStock] Supabase RPC failed:", error);
    }
  }
  return validateStock(lineItems);
}

export type SubmitPrescriptionInput = {
  fileName: string;
  notes: string;
  lineItems: PrescriptionLineItem[];
};

export type SubmitPrescriptionResult = {
  ok: boolean;
  message: string;
  prescription: PrescriptionRecord | null;
  order: PharmacyOrder | null;
  validation: StockValidationResult;
  bundle: PrescriptionsBundle;
};

/** Upload prescription metadata + line items, auto-create order when stock validates. */
export async function submitPrescriptionOrder(
  input: SubmitPrescriptionInput,
  customerId = MOCK_PROFILE.id,
  customerName = MOCK_PROFILE.fullName,
): Promise<SubmitPrescriptionResult> {
  await mockDelay(400);

  const ext = input.fileName.slice(input.fileName.lastIndexOf(".")).toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    const bundle = fetchBundleFromMock(customerId);
    return {
      ok: false,
      message: "Upload a PDF or image file (JPG, PNG, WEBP).",
      prescription: null,
      order: null,
      validation: { valid: false, errors: ["Invalid file type."], warnings: [], lineResults: [] },
      bundle,
    };
  }

  const validation = await validatePrescriptionStock(input.lineItems);
  if (!validation.valid) {
    const bundle = fetchBundleFromMock(customerId);
    return {
      ok: false,
      message: validation.errors[0] ?? "Stock validation failed.",
      prescription: null,
      order: null,
      validation,
      bundle,
    };
  }

  const medications = getMockMedications();
  const now = new Date().toISOString();

  const prescription: PrescriptionRecord = {
    id: `rx-${Date.now()}`,
    customerId,
    customerName,
    fileName: input.fileName,
    fileUrl: `/uploads/prescriptions/${customerId}/${input.fileName}`,
    notes: input.notes.trim(),
    status: "stock_validated",
    lineItems: input.lineItems.map((l) => ({ ...l })),
    orderId: null,
    stockValidatedAt: now,
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  const order = buildOrderFromPrescription(prescription, medications);
  prescription.orderId = order.id;
  prescription.status = "processing";

  addMockPrescription(prescription);
  addMockPharmacyOrder(order);
  decrementMedicationStock(input.lineItems);

  // Auto-advance to processing (replaces manual coordination)
  setTimeout(() => {
    updateMockPrescription(prescription.id, { status: "processing" });
    updateMockPharmacyOrder(order.id, { status: "processing" });
  }, 0);

  return {
    ok: true,
    message: `Order ${order.orderReference} created automatically. Stock validated — no manual coordination needed.`,
    prescription,
    order,
    validation,
    bundle: fetchBundleFromMock(customerId),
  };
}

/** Search medications for direct selection. */
export async function searchMedications(query: string): Promise<Medication[]> {
  await mockDelay(80);
  const q = query.trim().toLowerCase();
  const meds = getMockMedications();
  if (!q) return meds;
  return meds.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q) ||
      m.strength.toLowerCase().includes(q),
  );
}

export { findMedication };
