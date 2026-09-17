import type { Metadata } from "next";
import { privateAppMetadata } from "@/lib/seo";

export const metadata: Metadata = privateAppMetadata(
  "Account sign-in",
  "Secure Microsoft sign-in for MBSNM students and staff.",
);

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
