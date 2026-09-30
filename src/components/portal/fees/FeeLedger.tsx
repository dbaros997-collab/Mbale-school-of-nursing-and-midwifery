import { formatUgx } from "@/lib/portal/constants";
import type { FeeInvoice, FeeLineItem } from "@/lib/portal/schema";
import { DataCard } from "@/components/ui/DataCard";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";

type FeeLedgerProps = {
  invoice: FeeInvoice;
  lineItems: FeeLineItem[];
  studentName: string;
  studentNumber: string;
};

export function FeeLedger({ invoice, lineItems }: FeeLedgerProps) {
  return (
    <DataCard title="Detailed charges">
      <DataTable className="mt-2" caption="Fee line items">
        <DataTableHead>
          <tr>
            <th className="font-semibold">Charge</th>
            <th className="text-right font-semibold">Amount</th>
          </tr>
        </DataTableHead>
        <DataTableBody>
          {lineItems.map((line) => (
            <tr key={line.id}>
              <td className="text-foreground">{line.label}</td>
              <td className="text-right font-semibold text-primary">
                {formatUgx(line.amount)}
              </td>
            </tr>
          ))}
          <tr>
            <td className="font-bold text-primary">Total billed</td>
            <td className="text-right font-extrabold text-primary">
              {formatUgx(invoice.totalBilled)}
            </td>
          </tr>
        </DataTableBody>
      </DataTable>
    </DataCard>
  );
}
