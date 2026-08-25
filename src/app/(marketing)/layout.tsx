import { Header } from "@/components/layout/Header";
import { SiteStatusBar } from "@/components/layout/SiteStatusBar";
import { MarketingFooter } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteStatusBar />
      <Header />
      <div className="site-shell flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
        <MarketingFooter />
      </div>
      <WhatsAppFloat />
    </>
  );
}
