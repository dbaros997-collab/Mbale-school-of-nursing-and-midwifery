import { AboutBand } from "@/components/home/AboutBand";
import { ApplyBand } from "@/components/home/ApplyBand";
import { Footer } from "@/components/layout/Footer";

/** Static path — served directly from /public (no Next.js image optimizer cache). */
const FOOTER_WALLPAPER = "/images/footer-campus-wide.jpg";

/**
 * Campus aerial photo stays fixed in the viewport.
 * About + Apply + Footer (Contact Us) scroll over it.
 */
export function CampusWallpaperBand({ children }: { children?: React.ReactNode }) {
  return (
    <div className="campus-wallpaper relative">
      <div
        className="campus-wallpaper__media"
        style={{ backgroundImage: `url('${FOOTER_WALLPAPER}')` }}
        aria-hidden
      />

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
