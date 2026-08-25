"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function PortalIndexPage() {
  const router = useRouter();
  const { ready, isAuthenticated, isStudent } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (isAuthenticated && isStudent) {
      router.replace("/portal/dashboard");
    }
  }, [ready, isAuthenticated, isStudent, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted">
      Loading student portal…
    </div>
  );
}
