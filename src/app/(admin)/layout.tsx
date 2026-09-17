import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { privateAppMetadata } from "@/lib/seo";

export const metadata: Metadata = privateAppMetadata(
  "Staff Admin",
  "MBSNM staff control panel — restricted to authorised registry and academic officers.",
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
