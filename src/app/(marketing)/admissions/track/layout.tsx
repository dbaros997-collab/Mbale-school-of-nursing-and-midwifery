import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata("/admissions/track", {
  title: "Track Application",
  description: "Check the status of your MBSNM nursing or midwifery application online.",
});

export default function TrackApplicationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
