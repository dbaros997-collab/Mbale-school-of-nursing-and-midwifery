import { AboutBand } from "@/components/home/AboutBand";
import { ApplyBand } from "@/components/home/ApplyBand";
import { Footer } from "@/components/layout/Footer";

/** Static path — served directly from /public (no Next.js image optimizer cache). */
const FOOTER_WALLPAPER = "/images/footer-campus-building.jpg";

/**
 * Campus aerial photo stays fixed in the viewport.
 * About + Apply + Footer (Contact Us) scroll over it.
 */
export function CampusWallpaperBand({ children }: { children?: React.ReactNode }) {
  return (
    <div className="campus-wallpaper relative">
      <div
        className="campus-wallpaper__media bg-cover bg-center bg-no-repeat brightness-[1.03] contrast-[1.04] saturate-[1.06]"
        style={{ backgroundImage: `url('${FOOTER_WALLPAPER}')` }}
        aria-hidden
      >
        {/* Light bottom fade only — keeps footer text readable without washing out the photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-55% via-black/10 via-75% to-black/35" />
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
