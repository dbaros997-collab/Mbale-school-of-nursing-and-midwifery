import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata("/academics", {
  title: "Courses & Programs",
  description:
    "Explore diploma and certificate nursing and midwifery programmes offered at Mbale School of Nursing and Midwifery.",
});

export default function AcademicsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
