"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MOCK_ADMIN_PROFILE,
  MOCK_ADMIN_SESSION,
  MOCK_ADMIN_USER,
  MOCK_PROFILE,
  MOCK_SESSION,
  MOCK_USER,
  applyActiveStudentSession,
} from "@/lib/portal/mock-store";
import { setActiveStudent } from "@/lib/portal/student-registry";
import type { MicrosoftUserProfile } from "@/lib/microsoft/types";
import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";
import type {
  AdminProfile,
  Role,
  Session,
  StudentProfile,
  User,
} from "@/lib/portal/schema";

const AUTH_STORAGE_KEY = "mbsnm-portal-auth";
const STUDENT_ID_STORAGE_KEY = "mbsnm-portal-student-id";

type StoredAuth = "student" | "microsoft" | "demo-admin" | "logged-out";
type AuthProvider = "local" | "microsoft" | null;

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: StudentProfile | null;
  adminProfile: AdminProfile | null;
  isAuthenticated: boolean;
  needsActivation: boolean;
  ready: boolean;
  role: Role | null;
  isAdmin: boolean;
  isStudent: boolean;
  authProvider: AuthProvider;
  microsoftProfile: MicrosoftUserProfile | null;
  loginAsDemoStudent: () => void;
  applyStaffSession: (payload: {
    user: User;
    session: Session;
    adminProfile: AdminProfile;
  }) => void;
  applyActivatedSession: (payload: {
    user: User;
    session: Session;
    profile: StudentProfile;
  }) => void;
  applyMicrosoftSession: (payload: {
    user: User;
    session: Session;
    profile: StudentProfile;
    microsoftProfile: MicrosoftUserProfile;
  }) => void;
  logout: () => void;
  refreshProfile: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function cloneProfile(profile: StudentProfile): StudentProfile {
  return {
    ...profile,
    nextOfKin: { ...profile.nextOfKin },
    emergencyContact: { ...profile.emergencyContact },
    medicalInfo: { ...profile.medicalInfo },
  };
}

function snapshotProfile(): StudentProfile {
  return cloneProfile(MOCK_PROFILE);
}

function snapshotUser(): User {
  return { ...MOCK_USER };
}

function snapshotAdminUser(): User {
  return { ...MOCK_ADMIN_USER };
}

function snapshotAdminProfile(): AdminProfile {
  return { ...MOCK_ADMIN_PROFILE };
}

function readStoredAuth(): { mode: StoredAuth; studentUserId: string | null } {
  if (typeof window === "undefined") {
    return { mode: "logged-out", studentUserId: null };
  }
  try {
    const value = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    const studentUserId = window.sessionStorage.getItem(STUDENT_ID_STORAGE_KEY);
    if (value === "demo-admin") {
      return { mode: "demo-admin", studentUserId: null };
    }
    if (value === "microsoft") {
      return { mode: "microsoft", studentUserId: null };
    }
    if (value === "student" || value === "demo") {
      return { mode: "student", studentUserId };
    }
    if (value === "logged-out") {
      return { mode: "logged-out", studentUserId: null };
    }
    return { mode: "logged-out", studentUserId: null };
  } catch {
    return { mode: "logged-out", studentUserId: null };
  }
}

function writeStudentSession(userId: string) {
  try {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, "student");
    window.sessionStorage.setItem(STUDENT_ID_STORAGE_KEY, userId);
  } catch {
    /* ignore quota / private mode */
  }
}

function writeStoredAuth(value: StoredAuth) {
  try {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, value);
    if (value !== "student") {
      window.sessionStorage.removeItem(STUDENT_ID_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

async function restoreMicrosoftPortalSession(): Promise<{
  user: User;
  session: Session;
  profile: StudentProfile;
  microsoftProfile: MicrosoftUserProfile;
} | null> {
  try {
    const response = await fetchWithTimeout("/api/auth/microsoft/session", {
      cache: "no-store",
      timeoutMs: 10_000,
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      authenticated: boolean;
      profile?: MicrosoftUserProfile;
    };
    if (!payload.authenticated || !payload.profile) return null;

    const { mapMicrosoftProfileToPortalSession } = await import("@/lib/microsoft/portal-bridge");
    const portal = mapMicrosoftProfileToPortalSession(payload.profile);
    return { ...portal, microsoftProfile: payload.profile };
  } catch {
    return null;
  }
}

function restoreStudentSession(userId: string) {
  const active = setActiveStudent(userId);
  if (!active) return null;
  return {
    user: { ...active.user },
    profile: cloneProfile(active.profile),
    session: {
      id: `sess-${active.user.id}`,
      userId: active.user.id,
      role: "student" as const,
      token: `mock-jwt.student.${active.user.id}`,
      expiresAt: MOCK_SESSION.expiresAt,
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [authProvider, setAuthProvider] = useState<AuthProvider>(null);
  const [microsoftProfile, setMicrosoftProfile] = useState<MicrosoftUserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const stored = readStoredAuth();
      if (stored.mode === "demo-admin") {
        if (!cancelled) {
          setSession(MOCK_ADMIN_SESSION);
          setUser(snapshotAdminUser());
          setProfile(null);
          setAdminProfile(snapshotAdminProfile());
          setAuthProvider(null);
          setMicrosoftProfile(null);
          setReady(true);
        }
        return;
      }

      if (stored.mode === "microsoft") {
        const restored = await restoreMicrosoftPortalSession();
        if (!cancelled) {
          if (restored) {
            setSession(restored.session);
            setUser(restored.user);
            setProfile(restored.profile);
            setAdminProfile(null);
            setAuthProvider("microsoft");
            setMicrosoftProfile(restored.microsoftProfile);
          } else {
            writeStoredAuth("logged-out");
            setSession(null);
            setUser(null);
            setProfile(null);
            setAdminProfile(null);
            setAuthProvider(null);
            setMicrosoftProfile(null);
          }
          setReady(true);
        }
        return;
      }

      if (stored.mode === "student" && stored.studentUserId) {
        const restored = restoreStudentSession(stored.studentUserId);
        if (!cancelled) {
          if (restored) {
            setSession(restored.session);
            setUser(restored.user);
            setProfile(restored.profile);
            setAdminProfile(null);
            setAuthProvider("local");
            setMicrosoftProfile(null);
          }
          setReady(true);
        }
        return;
      }

      if (!cancelled) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setAdminProfile(null);
        setAuthProvider(null);
        setMicrosoftProfile(null);
        setReady(true);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const loginAsDemoStudent = useCallback(() => {
    const restored = restoreStudentSession("user-sarah");
    if (!restored) {
      applyActiveStudentSession(snapshotUser(), snapshotProfile());
      writeStudentSession("user-sarah");
      setSession(MOCK_SESSION);
      setUser(snapshotUser());
      setProfile(snapshotProfile());
    } else {
      writeStudentSession(restored.user.id);
      setSession(restored.session);
      setUser(restored.user);
      setProfile(restored.profile);
    }
    setAdminProfile(null);
    setAuthProvider("local");
    setMicrosoftProfile(null);
  }, []);

  const applyStaffSession = useCallback(
    (payload: { user: User; session: Session; adminProfile: AdminProfile }) => {
      writeStoredAuth("demo-admin");
      setUser({ ...payload.user });
      setSession({ ...payload.session });
      setAdminProfile({ ...payload.adminProfile });
      setProfile(null);
      setAuthProvider(null);
      setMicrosoftProfile(null);
    },
    [],
  );

  const applyActivatedSession = useCallback(
    (payload: { user: User; session: Session; profile: StudentProfile }) => {
      setActiveStudent(payload.user.id);
      writeStudentSession(payload.user.id);
      setUser({ ...payload.user });
      setSession({ ...payload.session });
      setProfile(cloneProfile(payload.profile));
      setAdminProfile(null);
      setAuthProvider("local");
      setMicrosoftProfile(null);
    },
    [],
  );

  const applyMicrosoftSession = useCallback(
    (payload: {
      user: User;
      session: Session;
      profile: StudentProfile;
      microsoftProfile: MicrosoftUserProfile;
    }) => {
      writeStoredAuth("microsoft");
      setUser({ ...payload.user });
      setSession({ ...payload.session });
      setProfile(cloneProfile(payload.profile));
      setAdminProfile(null);
      setAuthProvider("microsoft");
      setMicrosoftProfile({ ...payload.microsoftProfile });
    },
    [],
  );

  const refreshProfile = useCallback(() => {
    if (!user?.id) return;
    const active = setActiveStudent(user.id);
    if (active) {
      setProfile(cloneProfile(active.profile));
      setUser({ ...active.user });
    }
    setAdminProfile(null);
  }, [user?.id]);

  const logout = useCallback(() => {
    const wasMicrosoft = authProvider === "microsoft";
    writeStoredAuth("logged-out");
    setSession(null);
    setUser(null);
    setProfile(null);
    setAdminProfile(null);
    setAuthProvider(null);
    setMicrosoftProfile(null);

    if (wasMicrosoft) {
      void fetchWithTimeout("/api/auth/microsoft/session", {
        method: "DELETE",
        timeoutMs: 5_000,
      });
      void import("@/lib/microsoft/msal-browser").then(({ logoutMicrosoftClient }) =>
        logoutMicrosoftClient().catch(() => undefined),
      );
    }
  }, [authProvider]);

  const role = user?.role ?? null;

  const value = useMemo<AuthState>(
    () => ({
      user,
      session,
      profile,
      adminProfile,
      isAuthenticated: Boolean(session && user),
      needsActivation: Boolean(user && user.role === "student" && !user.accountActivated),
      ready,
      role,
      isAdmin: role === "admin",
      isStudent: role === "student",
      authProvider,
      microsoftProfile,
      loginAsDemoStudent,
      applyStaffSession,
      applyActivatedSession,
      applyMicrosoftSession,
      logout,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      adminProfile,
      ready,
      role,
      authProvider,
      microsoftProfile,
      loginAsDemoStudent,
      applyStaffSession,
      applyActivatedSession,
      applyMicrosoftSession,
      logout,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
