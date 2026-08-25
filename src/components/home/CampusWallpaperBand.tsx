import Image from "next/image";
import { AboutBand } from "@/components/home/AboutBand";
import { ApplyBand } from "@/components/home/ApplyBand";
import { Footer } from "@/components/layout/Footer";

/**
 * Admin-block watermark stays fixed in the viewport.
 * About + Apply + Footer (Contact Us) scroll over it.
 */
export function CampusWallpaperBand({ children }: { children?: React.ReactNode }) {
  return (
    <div className="campus-wallpaper relative">
      <div className="campus-wallpaper__media" aria-hidden>
        <Image
          src="/images/admin-block.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1200px"
          quality={65}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,36,86,0.72),rgba(22,53,127,0.55))]" />
      </div>

      <div className="relative z-10">
        {children ?? (
          <>
            <AboutBand />
            <ApplyBand />
            <Footer onWallpaper />
          </>
        )}
      </div>
    </div>
  );
}
