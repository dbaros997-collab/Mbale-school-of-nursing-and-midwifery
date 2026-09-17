import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata("/contact", {
  title: "Contact",
  description:
    "Contact Mbale School of Nursing and Midwifery — phone, email, WhatsApp, and campus location in Malere, Mbale, Uganda.",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
