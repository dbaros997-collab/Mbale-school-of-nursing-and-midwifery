"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import type { AdminFeesBundle } from "@/services/portal/admin/fees-types";
import { downloadAdminFinanceSummaryPdf } from "@/lib/admin/export-finance-summary-pdf";
import { Button } from "@/components/ui/Button";

type FinanceExportPdfButtonProps = {
  bundle: AdminFeesBundle | null;
  disabled?: boolean;
};

export function FinanceExportPdfButton({ bundle, disabled }: FinanceExportPdfButtonProps) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (!bundle || exporting) return;
    setExporting(true);
    try {
      const [studentsRes, paymentsRes] = await Promise.all([
        fetch("/api/admin/fees/students?page=1&pageSize=100&sort=name&sortDir=asc", {
          cache: "no-store",
          credentials: "same-origin",
        }),
        fetch("/api/admin/fees/payments?page=1&pageSize=50", {
          cache: "no-store",
          credentials: "same-origin",
        }),
      ]);
      const studentsJson = studentsRes.ok
        ? ((await studentsRes.json()) as { rows: typeof bundle.students })
        : { rows: [] };
      const paymentsJson = paymentsRes.ok
        ? ((await paymentsRes.json()) as { rows: typeof bundle.payments })
        : { rows: [] };

      await downloadAdminFinanceSummaryPdf({
        ...bundle,
        students: studentsJson.rows,
        payments: paymentsJson.rows,
      });
    } catch (error) {
      console.error("[FinanceExportPdfButton]", error);
      window.alert("Could not generate the PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="shrink-0 border border-border bg-white shadow-sm"
      disabled={disabled || !bundle || exporting}
      onClick={() => void handleExport()}
    >
      {exporting ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <FileDown className="h-4 w-4" aria-hidden />
      )}
      Export PDF summary
    </Button>
  );
}
