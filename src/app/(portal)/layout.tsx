import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { privateAppMetadata } from "@/lib/seo";

export const metadata: Metadata = privateAppMetadata(
  "Student Portal",
  "MBSNM student portal — dashboard, fees, registration, and LMS tools.",
);

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell>{children}</PortalShell>;
}
