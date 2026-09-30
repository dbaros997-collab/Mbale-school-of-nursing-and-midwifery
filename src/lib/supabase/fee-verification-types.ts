/** Bank payment verification — mirrors supabase/migrations/004_bank_payment_verification.sql */

import type { PaymentMethod, PaymentVerificationStatus } from "@/lib/portal/schema";

export type BankPaymentSubmissionRow = {
  id: string;
  student_id: string;
  invoice_id: string | null;
  amount: number;
  payment_method: PaymentMethod;
  transaction_reference: string;
  deposit_slip_url: string | null;
  deposit_slip_file_name: string | null;
  status: PaymentVerificationStatus;
  review_note: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  payment_record_id: string | null;
};

export type BankPaymentSubmission = {
  id: string;
  studentId: string;
  invoiceId: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  depositSlipUrl: string | null;
  depositSlipFileName: string | null;
  status: PaymentVerificationStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  submittedAt: string;
  paymentRecordId: string | null;
};

export function mapBankPaymentSubmissionRow(row: BankPaymentSubmissionRow): BankPaymentSubmission {
  return {
    id: row.id,
    studentId: row.student_id,
    invoiceId: row.invoice_id,
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    transactionReference: row.transaction_reference,
    depositSlipUrl: row.deposit_slip_url,
    depositSlipFileName: row.deposit_slip_file_name,
    status: row.status,
    reviewNote: row.review_note,
    reviewedAt: row.reviewed_at,
    submittedAt: row.submitted_at,
    paymentRecordId: row.payment_record_id,
  };
}
