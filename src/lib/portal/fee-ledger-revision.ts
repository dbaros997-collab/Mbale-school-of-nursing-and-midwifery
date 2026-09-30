/** Monotonic revision for fee ledger changes (server mock store + sync endpoints). */

let feeLedgerRevision = 1;
const studentFeeLedgerRevisions = new Map<string, number>();

export function getFeeLedgerRevision(): number {
  return feeLedgerRevision;
}

export function getStudentFeeLedgerRevision(studentId: string): number {
  return studentFeeLedgerRevisions.get(studentId) ?? feeLedgerRevision;
}

export function bumpFeeLedgerRevision(): number {
  feeLedgerRevision += 1;
  return feeLedgerRevision;
}

export function bumpStudentFeeLedgerRevision(studentId: string): number {
  const next = (studentFeeLedgerRevisions.get(studentId) ?? 0) + 1;
  studentFeeLedgerRevisions.set(studentId, next);
  feeLedgerRevision += 1;
  return next;
}
