import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata("/admissions", {
  title: "Admissions",
  description:
    "Apply to MBSNM — admission requirements, intakes, application steps, and fees for nursing and midwifery programmes in Uganda.",
});

export default function AdmissionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
