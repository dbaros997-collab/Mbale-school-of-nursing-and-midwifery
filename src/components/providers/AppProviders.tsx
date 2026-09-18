"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientDeployRecovery } from "@/components/providers/ClientDeployRecovery";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);

  return (
    <AuthProvider>
      <ClientDeployRecovery />
      {children}
    </AuthProvider>
  );
}
