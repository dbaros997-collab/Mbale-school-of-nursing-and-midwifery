import { Hero } from "@/components/home/Hero";
import { Discovery } from "@/components/home/Discovery";
import { CampusNews } from "@/components/home/CampusNews";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { SpotlightGrid } from "@/components/home/SpotlightGrid";
import { VisionMission } from "@/components/home/VisionMission";
import { CampusWallpaperBand } from "@/components/home/CampusWallpaperBand";
import { ApplyBand } from "@/components/home/ApplyBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Discovery />
      <CampusNews />
      <UpcomingEvents />
      <SpotlightGrid />
      <VisionMission />
      <CampusWallpaperBand />
      <div className="bg-white pb-8 pt-2 sm:pb-10">
        <ApplyBand />
      </div>
    </>
  );
}
