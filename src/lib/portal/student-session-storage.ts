import type { Session, StudentProfile, User } from "./schema";

const SESSION_KEY = "mbsnm-portal-student-session";

export type StoredStudentSession = {
  user: User;
  profile: StudentProfile;
  session: Session;
};

export function persistStudentSession(payload: StoredStudentSession) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function readStoredStudentSession(): StoredStudentSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredStudentSession;
  } catch {
    return null;
  }
}

export function clearStoredStudentSession() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function createStudentSession(user: User): Session {
  return {
    id: `sess-${user.id}`,
    userId: user.id,
    role: "student",
    token: `portal.${user.id}`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
  };
}
