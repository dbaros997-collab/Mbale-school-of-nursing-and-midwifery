import {
  MOCK_PROFILE,
  addMockDocumentRequest,
  mockDocumentRequests,
  updateMockDocumentRequest,
} from "@/lib/portal/mock-store";
import type { DocumentRequest, DocumentRequestStatus } from "@/lib/portal/schema";
import { DOCUMENT_STATUS_LABELS } from "@/lib/portal/constants";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type DocumentType = DocumentRequest["type"];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  testimonial: "Testimonial / Certificate of Character",
  recommendation: "Recommendation Letter",
  admission_letter: "Admission Letter (copy)",
};

export type DocumentsBundle = {
  requests: DocumentRequest[];
};

/** Ready for GET /api/portal/documents */
export async function getDocumentsBundle(
  studentId = MOCK_PROFILE.id,
): Promise<DocumentsBundle> {
  await delay(220);
  return {
    requests: mockDocumentRequests
      .filter((r) => r.studentId === studentId)
      .sort(
        (a, b) =>
          new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
      ),
  };
}

/** Ready for POST /api/portal/documents */
export async function requestDocument(
  type: DocumentType,
  studentId = MOCK_PROFILE.id,
): Promise<{ ok: boolean; message: string; bundle: DocumentsBundle }> {
  await delay(500);

  const openSame = mockDocumentRequests.find(
    (r) =>
      r.studentId === studentId &&
      r.type === type &&
      (r.status === "processing" || r.status === "ready"),
  );
  if (openSame) {
    return {
      ok: false,
      message: `You already have a ${DOCUMENT_TYPE_LABELS[type]} request that is ${DOCUMENT_STATUS_LABELS[openSame.status].toLowerCase()}.`,
      bundle: await getDocumentsBundle(studentId),
    };
  }

  const req: DocumentRequest = {
    id: `doc-${Date.now()}`,
    studentId,
    type,
    status: "processing",
    requestedAt: new Date().toISOString(),
    readyAt: null,
  };
  addMockDocumentRequest(req);

  // Simulate async processing becoming ready after a short delay (demo)
  setTimeout(() => {
    updateMockDocumentRequest(req.id, {
      status: "ready",
      readyAt: new Date().toISOString(),
    });
  }, 8000);

  return {
    ok: true,
    message: `${DOCUMENT_TYPE_LABELS[type]} submitted. Status: Processing.`,
    bundle: await getDocumentsBundle(studentId),
  };
}

/** Ready for POST /api/portal/documents/:id/download */
export async function markDocumentDownloaded(
  id: string,
  studentId = MOCK_PROFILE.id,
): Promise<{
  ok: boolean;
  message: string;
  fileName?: string;
  blob?: Blob;
  bundle: DocumentsBundle;
}> {
  await delay(350);
  const row = mockDocumentRequests.find((r) => r.id === id && r.studentId === studentId);
  if (!row) {
    return {
      ok: false,
      message: "Request not found.",
      bundle: await getDocumentsBundle(studentId),
    };
  }
  if (row.status === "processing") {
    return {
      ok: false,
      message: "Document is still processing.",
      bundle: await getDocumentsBundle(studentId),
    };
  }

  updateMockDocumentRequest(id, { status: "downloaded" as DocumentRequestStatus });

  const label = DOCUMENT_TYPE_LABELS[row.type];
  const fileName = `${label.replace(/[^\w\s-]/g, "").trim()}.txt`;
  const blob = new Blob(
    [
      "MBSNM Registry — Official Document (Mock)",
      "========================================",
      `Student: ${MOCK_PROFILE.fullName} (${MOCK_PROFILE.studentNumber})`,
      `Document: ${label}`,
      `Issued: ${row.readyAt ?? new Date().toISOString()}`,
      "",
      "This is a simulated downloadable document for portal demonstration.",
    ].join("\n"),
    { type: "text/plain" },
  );

  return {
    ok: true,
    message: "Document downloaded. Status updated.",
    fileName,
    blob,
    bundle: await getDocumentsBundle(studentId),
  };
}
