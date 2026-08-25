"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
