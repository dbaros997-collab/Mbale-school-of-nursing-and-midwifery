import Image from "next/image";
import { AboutBand } from "@/components/home/AboutBand";
import { ApplyBand } from "@/components/home/ApplyBand";
import { Footer } from "@/components/layout/Footer";

const CAMPUS_WALLPAPER_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "campus-wallpaper-v2";

function campusWallpaperAsset(path: string) {
  return `${path}?v=${CAMPUS_WALLPAPER_VERSION}`;
}

/**
 * Campus aerial photo stays fixed in the viewport.
 * About + Apply + Footer (Contact Us) scroll over it.
 */
export function CampusWallpaperBand({ children }: { children?: React.ReactNode }) {
  return (
    <div className="campus-wallpaper relative">
      <div className="campus-wallpaper__media" aria-hidden>
        <Image
          src={campusWallpaperAsset("/images/campus-wallpaper.jpg")}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1200px"
          quality={80}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,36,86,0.48),rgba(22,53,127,0.32))]" />
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
