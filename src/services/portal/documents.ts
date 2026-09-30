import type { DocumentRequest, DocumentRequestStatus } from "@/lib/portal/schema";

export type DocumentType = DocumentRequest["type"];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  testimonial: "Testimonial / Certificate of Character",
  recommendation: "Recommendation Letter",
  admission_letter: "Admission Letter (copy)",
};

export type DocumentsBundle = {
  requests: DocumentRequest[];
};

export async function getDocumentsBundle(_studentId?: string): Promise<DocumentsBundle> {
  return { requests: [] };
}

export async function requestDocument(
  _type: DocumentType,
  _studentId?: string,
): Promise<{ ok: boolean; message: string; bundle: DocumentsBundle }> {
  return {
    ok: false,
    message: "Document requests will appear here once the registry enables online document services.",
    bundle: { requests: [] },
  };
}

export async function markDocumentDownloaded(
  _id: string,
  _studentId?: string,
): Promise<{
  ok: boolean;
  message: string;
  bundle: DocumentsBundle;
  fileName?: string;
  blob?: Blob;
}> {
  return { ok: false, message: "Document not found.", bundle: { requests: [] } };
}
