"use client";

import { useCallback, useState } from "react";
import type { ApplicationPayload } from "@/lib/data";
import type { ApplicationTrackingStatus, EligibilityResult, InterviewDetails } from "@/lib/admissions/types";
import {
  mockApplicationPayment,
  processApplicationAfterPayment,
} from "@/services/admissions/application";
import { getProgramTitle } from "@/services/admissions/eligibility";

export type QualificationOutcomeData = {
  applicationReference: string;
  transactionReference: string;
  eligibility: EligibilityResult;
  queuedForReview: boolean;
  trackingStatus: import("@/lib/admissions/types").ApplicationTrackingStatus;
  email: string;
  phone: string;
  programTitle: string;
  interview?: InterviewDetails | null;
};

export function useSubmitApplication() {
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [outcome, setOutcome] = useState<QualificationOutcomeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionReference, setTransactionReference] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const payAndVerify = useCallback(async (payload: ApplicationPayload) => {
    if (!payload.paymentReference.trim()) {
      setPaymentError("Enter your bank transfer reference.");
      return;
    }

    if (!payload.feePolicyAcknowledged) {
      setPaymentError("Confirm that you understand the application fee is non-refundable.");
      return;
    }

    setPaying(true);
    setPaymentError(null);
    setError(null);

    try {
      const payment = await mockApplicationPayment({
        transferReference: payload.paymentReference,
      });

      if (!payment.ok || !payment.transactionReference) {
        setPaymentError(payment.message);
        return;
      }

      setTransactionReference(payment.transactionReference);
      setPaymentConfirmed(true);
      setPaying(false);
      setVerifying(true);

      const result = await processApplicationAfterPayment({
        ...payload,
        paymentConfirmed: true,
        paymentMethod: "bank",
        transactionReference: payment.transactionReference,
      });

      if (!result.ok || !result.applicationReference || !result.eligibility) {
        setError(result.message);
        return;
      }

      setOutcome({
        applicationReference: result.applicationReference,
        transactionReference: result.transactionReference ?? payment.transactionReference,
        eligibility: result.eligibility,
        queuedForReview: result.queuedForReview ?? false,
        trackingStatus: (result.trackingStatus ?? "pending") as ApplicationTrackingStatus,
        email: payload.email,
        phone: payload.phone,
        programTitle: payload.programId ? getProgramTitle(payload.programId) : "",
        interview: result.interview ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPaying(false);
      setVerifying(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOutcome(null);
    setError(null);
    setPaymentError(null);
    setTransactionReference(null);
    setPaymentConfirmed(false);
    setVerifying(false);
  }, []);

  const resetPaymentOnly = useCallback(() => {
    setOutcome(null);
    setError(null);
    setPaymentError(null);
    setTransactionReference(null);
    setPaymentConfirmed(false);
    setVerifying(false);
  }, []);

  return {
    payAndVerify,
    paying,
    verifying,
    outcome,
    error,
    paymentError,
    transactionReference,
    paymentConfirmed,
    reset,
    resetPaymentOnly,
  };
}
