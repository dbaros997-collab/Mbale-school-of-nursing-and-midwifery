/** Pharmacy module — prescriptions, medication stock, automated orders. */

export type MedicationForm = "tablet" | "capsule" | "syrup" | "injection" | "cream" | "drops";

export type PrescriptionStatus =
  | "draft"
  | "submitted"
  | "stock_validated"
  | "processing"
  | "ready"
  | "fulfilled"
  | "stock_unavailable"
  | "cancelled";

export type PharmacyOrderStatus =
  | "pending"
  | "validated"
  | "processing"
  | "ready"
  | "fulfilled"
  | "cancelled"
  | "stock_failed";

export type Medication = {
  id: string;
  sku: string;
  name: string;
  strength: string;
  form: MedicationForm;
  stockQuantity: number;
  reorderLevel: number;
  unitPriceUgx: number;
  requiresPrescription: boolean;
  active: boolean;
};

export type PrescriptionLineItem = {
  medicationId: string;
  quantity: number;
};

export type PrescriptionRecord = {
  id: string;
  customerId: string;
  customerName: string;
  fileName: string;
  fileUrl: string | null;
  notes: string;
  status: PrescriptionStatus;
  lineItems: PrescriptionLineItem[];
  orderId: string | null;
  stockValidatedAt: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PharmacyOrder = {
  id: string;
  orderReference: string;
  prescriptionId: string;
  customerId: string;
  customerName: string;
  status: PharmacyOrderStatus;
  totalAmountUgx: number;
  lineItems: {
    medicationId: string;
    medicationName: string;
    sku: string;
    quantity: number;
    unitPriceUgx: number;
    inStock: boolean;
  }[];
  createdAt: string;
  fulfilledAt: string | null;
};

export type StockValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  lineResults: {
    medicationId: string;
    medicationName: string;
    requested: number;
    available: number;
    sufficient: boolean;
  }[];
};

export type PrescriptionsBundle = {
  medications: Medication[];
  prescriptions: PrescriptionRecord[];
  orders: PharmacyOrder[];
};

export type PharmacyAdminBundle = {
  medications: Medication[];
  prescriptions: PrescriptionRecord[];
  orders: PharmacyOrder[];
  metrics: {
    pendingPrescriptions: number;
    lowStockCount: number;
    ordersToday: number;
    fulfilledThisWeek: number;
  };
};

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  stock_validated: "Stock validated",
  processing: "Processing",
  ready: "Ready for pickup",
  fulfilled: "Fulfilled",
  stock_unavailable: "Stock unavailable",
  cancelled: "Cancelled",
};

export const PHARMACY_ORDER_STATUS_LABELS: Record<PharmacyOrderStatus, string> = {
  pending: "Pending",
  validated: "Validated",
  processing: "Processing",
  ready: "Ready",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  stock_failed: "Stock failed",
};

export const MEDICATION_FORM_LABELS: Record<MedicationForm, string> = {
  tablet: "Tablet",
  capsule: "Capsule",
  syrup: "Syrup",
  injection: "Injection",
  cream: "Cream",
  drops: "Drops",
};
