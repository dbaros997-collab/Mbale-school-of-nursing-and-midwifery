import { Header } from "@/components/layout/Header";
import { SiteStatusBar } from "@/components/layout/SiteStatusBar";
import { MarketingFooter } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

/** Fresh HTML after each deploy — avoid 1-year CDN cache on marketing pages. */
export const revalidate = 0;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteStatusBar />
      <Header />
      <div className="site-shell flex min-w-0 flex-1 flex-col overflow-x-hidden pt-[calc(var(--site-status-bar-height)+var(--site-header-height))] [&:has(#main-content>.homepage-slider:first-child)]:pt-0">
        <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
        <MarketingFooter />
      </div>
      <WhatsAppFloat />
    </>
  );
}
