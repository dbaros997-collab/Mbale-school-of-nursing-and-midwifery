import type { jsPDF } from "jspdf";
import type { AdminFeesBundle } from "@/services/portal/admin/fees-types";

type PdfWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };
import {
  FINANCIAL_CLEARANCE_LABELS,
  formatUgx,
  SCHOOL_FEE_BANK_DETAILS,
  STUDENT_ACCOUNT_STATUS_LABELS,
} from "@/lib/portal/constants";
import { OFFICIAL_SITE_URL } from "@/lib/site-url";

const SCHOOL_NAME = "Mbale School of Nursing and Midwifery";
const SCHOOL_MOTTO = "With GOD We Love and Serve";
const BRAND_NAVY: [number, number, number] = [15, 42, 68];
const BRAND_GOLD: [number, number, number] = [198, 156, 47];

function formatReportTimestamp(date: Date): string {
  return date.toLocaleString("en-UG", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Kampala",
  });
}

function slugDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Client-side PDF export for board / administration reviews. */
export async function downloadAdminFinanceSummaryPdf(bundle: AdminFeesBundle): Promise<void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;

  const generatedAt = new Date();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 0;

  doc.setFillColor(...BRAND_NAVY);
  doc.rect(0, 0, pageWidth, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(SCHOOL_NAME, margin, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(SCHOOL_MOTTO, margin, 18);
  doc.setFontSize(8);
  doc.text(OFFICIAL_SITE_URL.replace(/^https:\/\//, ""), margin, 24);

  doc.setTextColor(...BRAND_GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Finance Ledger Summary", pageWidth - margin, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 220, 220);
  doc.setFontSize(8);
  doc.text(bundle.semesterLabel, pageWidth - margin, 18, { align: "right" });

  y = 40;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.text(`Generated: ${formatReportTimestamp(generatedAt)} (EAT)`, margin, y);
  doc.text(`Ledger revision: ${bundle.ledgerRevision}`, pageWidth - margin, y, {
    align: "right",
  });

  y += 8;
  doc.setDrawColor(...BRAND_GOLD);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Total collected", formatUgx(bundle.totalCollected)],
      ["Total outstanding", formatUgx(bundle.totalOutstanding)],
      ["Payments awaiting verification", String(bundle.pendingReviewCount)],
      ["Overdue student accounts", String(bundle.overdueAccountCount)],
      ["Stale verifications (> SLA)", String(bundle.staleVerificationCount)],
    ],
    theme: "grid",
    headStyles: { fillColor: BRAND_NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 2.5 },
    margin: { left: margin, right: margin },
  });

  y = (doc as PdfWithAutoTable).lastAutoTable!.finalY + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND_NAVY);
  doc.text("Portal activation & onboarding", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Indicator", "Count"]],
    body: [
      ["Awaiting first-time portal activation", String(bundle.onboarding.pendingPortalActivation)],
      ["Activated portal accounts", String(bundle.onboarding.activatedPortalAccounts)],
      ["Student accounts pending approval", String(bundle.onboarding.pendingAccountApproval)],
      [
        "Data source",
        bundle.onboarding.supabaseConnected ? "Supabase (live)" : "Not connected",
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: BRAND_NAVY },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  y = (doc as PdfWithAutoTable).lastAutoTable!.finalY + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Online payments (Flutterwave)", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Indicator", "Value"]],
    body: [
      ["Gateway configured", bundle.gateway.configured ? "Yes" : "No"],
      ["In-flight checkout sessions", String(bundle.gateway.pendingCheckoutCount)],
      ["Completed sessions (recent window)", String(bundle.gateway.completedSessionCount)],
    ],
    theme: "striped",
    headStyles: { fillColor: BRAND_NAVY },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  y = (doc as PdfWithAutoTable).lastAutoTable!.finalY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Student fee status", margin, y);
  y += 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const totalStudents = bundle.totalStudentCount ?? bundle.students.length;
  doc.text(
    totalStudents > bundle.students.length
      ? `Showing first ${bundle.students.length} of ${totalStudents.toLocaleString()} students (export sample).`
      : `${totalStudents.toLocaleString()} students on record.`,
    margin,
    y + 4,
  );
  y += 8;
  doc.setTextColor(...BRAND_NAVY);

  const studentRows = bundle.students.map((s) => [
    s.fullName,
    s.studentNumber,
    formatUgx(s.feeTotalBilled),
    formatUgx(s.feeTotalPaid),
    formatUgx(s.feeBalance),
    STUDENT_ACCOUNT_STATUS_LABELS[s.accountStatus],
    FINANCIAL_CLEARANCE_LABELS[s.financialClearance],
  ]);

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Student",
        "Number",
        "Billed",
        "Paid",
        "Balance",
        "Account",
        "Clearance",
      ],
    ],
    body: studentRows,
    theme: "striped",
    headStyles: { fillColor: BRAND_NAVY, fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 28 },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `${SCHOOL_NAME} · Official collection: ${SCHOOL_FEE_BANK_DETAILS.bankName} · ${SCHOOL_FEE_BANK_DETAILS.accountNumber}`,
        margin,
        doc.internal.pageSize.getHeight() - 8,
      );
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 8,
        { align: "right" },
      );
    },
  });

  const recentPayments = bundle.payments.slice(0, 15);
  if (recentPayments.length > 0) {
    y = (doc as PdfWithAutoTable).lastAutoTable!.finalY + 10;
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND_NAVY);
    doc.text("Recent payment transactions", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Date", "Student", "Amount", "Method", "Reference", "Status"]],
      body: recentPayments.map((p) => [
        new Date(p.paidAt).toLocaleString("en-UG", { dateStyle: "medium", timeStyle: "short" }),
        p.studentName,
        formatUgx(p.amount),
        p.method.toUpperCase(),
        p.reference.length > 24 ? `${p.reference.slice(0, 21)}…` : p.reference,
        p.status,
      ]),
      theme: "grid",
      headStyles: { fillColor: BRAND_NAVY, fontSize: 8 },
      styles: { fontSize: 7.5 },
      margin: { left: margin, right: margin },
    });
  }

  doc.save(`Mbale School of Nursing and Midwifery-finance-summary-${slugDate(generatedAt)}.pdf`);
}
