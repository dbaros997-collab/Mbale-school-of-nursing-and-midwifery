"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_PROFILE, MOCK_SESSION, MOCK_USER } from "@/lib/portal/mock-store";
import type { Role, Session, StudentProfile, User } from "@/lib/portal/schema";

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: StudentProfile | null;
  isAuthenticated: boolean;
  role: Role | null;
  loginAsDemoStudent: () => void;
  logout: () => void;
  refreshProfile: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function snapshotProfile(): StudentProfile {
  return {
    ...MOCK_PROFILE,
    nextOfKin: { ...MOCK_PROFILE.nextOfKin },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(MOCK_SESSION);
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [profile, setProfile] = useState<StudentProfile | null>(snapshotProfile);

  const loginAsDemoStudent = useCallback(() => {
    setSession(MOCK_SESSION);
    setUser(MOCK_USER);
    setProfile(snapshotProfile());
  }, []);

  const refreshProfile = useCallback(() => {
    setProfile(snapshotProfile());
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setTimeout(() => {
      setSession(MOCK_SESSION);
      setUser(MOCK_USER);
      setProfile(snapshotProfile());
    }, 400);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      session,
      profile,
      isAuthenticated: Boolean(session && user),
      role: user?.role ?? null,
      loginAsDemoStudent,
      logout,
      refreshProfile,
    }),
    [user, session, profile, loginAsDemoStudent, logout, refreshProfile],
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
