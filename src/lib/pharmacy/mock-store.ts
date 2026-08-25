import type {
  Medication,
  PharmacyOrder,
  PrescriptionLineItem,
  PrescriptionRecord,
  StockValidationResult,
} from "@/lib/pharmacy/types";

export const MOCK_MEDICATIONS: Medication[] = [
  { id: "med-paracetamol-500", sku: "RX-PAR-500", name: "Paracetamol", strength: "500mg", form: "tablet", stockQuantity: 420, reorderLevel: 100, unitPriceUgx: 500, requiresPrescription: false, active: true },
  { id: "med-amox-500", sku: "RX-AMX-500", name: "Amoxicillin", strength: "500mg", form: "capsule", stockQuantity: 85, reorderLevel: 50, unitPriceUgx: 1200, requiresPrescription: true, active: true },
  { id: "med-metformin-500", sku: "RX-MET-500", name: "Metformin", strength: "500mg", form: "tablet", stockQuantity: 160, reorderLevel: 40, unitPriceUgx: 800, requiresPrescription: true, active: true },
  { id: "med-omeprazole-20", sku: "RX-OME-20", name: "Omeprazole", strength: "20mg", form: "capsule", stockQuantity: 12, reorderLevel: 30, unitPriceUgx: 1500, requiresPrescription: true, active: true },
  { id: "med-cetirizine-10", sku: "RX-CET-10", name: "Cetirizine", strength: "10mg", form: "tablet", stockQuantity: 200, reorderLevel: 50, unitPriceUgx: 600, requiresPrescription: false, active: true },
  { id: "med-salbutamol-inh", sku: "RX-SAL-INH", name: "Salbutamol inhaler", strength: "100mcg", form: "drops", stockQuantity: 28, reorderLevel: 15, unitPriceUgx: 8500, requiresPrescription: true, active: true },
  { id: "med-ors-sachet", sku: "RX-ORS-1", name: "Oral rehydration salts", strength: "1 sachet", form: "syrup", stockQuantity: 350, reorderLevel: 80, unitPriceUgx: 400, requiresPrescription: false, active: true },
  { id: "med-diclofenac-gel", sku: "RX-DIC-GEL", name: "Diclofenac gel", strength: "1%", form: "cream", stockQuantity: 45, reorderLevel: 20, unitPriceUgx: 4500, requiresPrescription: true, active: true },
  { id: "med-artemether-lum", sku: "RX-ALU", name: "Artemether/Lumefantrine", strength: "20/120mg", form: "tablet", stockQuantity: 0, reorderLevel: 25, unitPriceUgx: 3500, requiresPrescription: true, active: true },
  { id: "med-insulin-nph", sku: "RX-INS-NPH", name: "Insulin NPH", strength: "100IU/ml", form: "injection", stockQuantity: 18, reorderLevel: 10, unitPriceUgx: 45000, requiresPrescription: true, active: true },
];

let mockPrescriptions: PrescriptionRecord[] = [
  {
    id: "rx-001",
    customerId: "stu-sarah",
    customerName: "Nagudi Sarah",
    fileName: "prescription-clinic-feb.pdf",
    fileUrl: "/uploads/prescriptions/prescription-clinic-feb.pdf",
    notes: "Monthly refill from Mbale Referral Hospital",
    status: "processing",
    lineItems: [
      { medicationId: "med-metformin-500", quantity: 60 },
      { medicationId: "med-amox-500", quantity: 21 },
    ],
    orderId: "po-001",
    stockValidatedAt: new Date(Date.now() - 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

let mockPharmacyOrders: PharmacyOrder[] = [
  {
    id: "po-001",
    orderReference: "RX-ORD-2026-0041",
    prescriptionId: "rx-001",
    customerId: "stu-sarah",
    customerName: "Nagudi Sarah",
    status: "processing",
    totalAmountUgx: 73200,
    lineItems: [
      { medicationId: "med-metformin-500", medicationName: "Metformin 500mg", sku: "RX-MET-500", quantity: 60, unitPriceUgx: 800, inStock: true },
      { medicationId: "med-amox-500", medicationName: "Amoxicillin 500mg", sku: "RX-AMX-500", quantity: 21, unitPriceUgx: 1200, inStock: true },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    fulfilledAt: null,
  },
];

let orderCounter = 42;

export function getMockMedications(): Medication[] {
  return MOCK_MEDICATIONS.map((m) => ({ ...m }));
}

export function getMockPrescriptions(customerId?: string): PrescriptionRecord[] {
  const list = customerId
    ? mockPrescriptions.filter((p) => p.customerId === customerId)
    : mockPrescriptions;
  return list.map((p) => ({
    ...p,
    lineItems: p.lineItems.map((l) => ({ ...l })),
  }));
}

export function getMockPharmacyOrders(customerId?: string): PharmacyOrder[] {
  const list = customerId
    ? mockPharmacyOrders.filter((o) => o.customerId === customerId)
    : mockPharmacyOrders;
  return list.map((o) => ({
    ...o,
    lineItems: o.lineItems.map((l) => ({ ...l })),
  }));
}

export function findMedication(id: string): Medication | undefined {
  const med = MOCK_MEDICATIONS.find((m) => m.id === id);
  return med ? { ...med } : undefined;
}

export function validateStock(
  lineItems: PrescriptionLineItem[],
  medications = MOCK_MEDICATIONS,
): StockValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const lineResults: StockValidationResult["lineResults"] = [];

  for (const line of lineItems) {
    const med = medications.find((m) => m.id === line.medicationId);
    if (!med) {
      errors.push(`Unknown medication selected.`);
      continue;
    }
    if (!med.active) {
      errors.push(`${med.name} is no longer available.`);
      continue;
    }
    const sufficient = med.stockQuantity >= line.quantity;
    lineResults.push({
      medicationId: med.id,
      medicationName: `${med.name} ${med.strength}`,
      requested: line.quantity,
      available: med.stockQuantity,
      sufficient,
    });
    if (!sufficient) {
      errors.push(
        `${med.name} ${med.strength}: requested ${line.quantity}, only ${med.stockQuantity} in stock.`,
      );
    } else if (med.stockQuantity - line.quantity <= med.reorderLevel) {
      warnings.push(`${med.name} will fall below reorder level after this order.`);
    }
  }

  if (lineItems.length === 0) {
    errors.push("Add at least one medication to your order.");
  }

  return { valid: errors.length === 0, errors, warnings, lineResults };
}

export function addMockPrescription(record: PrescriptionRecord): void {
  mockPrescriptions = [record, ...mockPrescriptions];
}

export function updateMockPrescription(
  id: string,
  patch: Partial<PrescriptionRecord>,
): PrescriptionRecord | null {
  const idx = mockPrescriptions.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  mockPrescriptions[idx] = {
    ...mockPrescriptions[idx],
    ...patch,
    lineItems: patch.lineItems ?? mockPrescriptions[idx].lineItems,
    updatedAt: new Date().toISOString(),
  };
  return { ...mockPrescriptions[idx], lineItems: [...mockPrescriptions[idx].lineItems] };
}

export function addMockPharmacyOrder(order: PharmacyOrder): void {
  mockPharmacyOrders = [order, ...mockPharmacyOrders];
}

export function updateMockPharmacyOrder(
  id: string,
  patch: Partial<PharmacyOrder>,
): PharmacyOrder | null {
  const idx = mockPharmacyOrders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  mockPharmacyOrders[idx] = { ...mockPharmacyOrders[idx], ...patch };
  return { ...mockPharmacyOrders[idx], lineItems: [...mockPharmacyOrders[idx].lineItems] };
}

export function decrementMedicationStock(
  lineItems: PrescriptionLineItem[],
): void {
  for (const line of lineItems) {
    const med = MOCK_MEDICATIONS.find((m) => m.id === line.medicationId);
    if (med) {
      med.stockQuantity = Math.max(0, med.stockQuantity - line.quantity);
    }
  }
}

export function nextOrderReference(): string {
  orderCounter += 1;
  return `RX-ORD-2026-${String(orderCounter).padStart(4, "0")}`;
}

export function resetMockPharmacyStore(): void {
  mockPrescriptions = [];
  mockPharmacyOrders = [];
}
