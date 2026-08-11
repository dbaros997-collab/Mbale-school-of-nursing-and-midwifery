import { AboutBand } from "@/components/home/AboutBand";
import { Voices } from "@/components/home/Voices";

/**
 * Grace High–style fixed campus wallpaper behind bottom content.
 */
export function CampusWallpaperBand({ children }: { children?: React.ReactNode }) {
  return (
    <div className="campus-wallpaper relative isolate">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/55 to-primary-dark/75"
      />
      <div className="relative z-10">{children ?? (
        <>
          <AboutBand />
          <Voices />
        </>
      )}</div>
    </div>
  );
}
