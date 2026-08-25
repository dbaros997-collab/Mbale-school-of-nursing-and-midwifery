import { Hero } from "@/components/home/Hero";
import { Discovery } from "@/components/home/Discovery";
import { LearningPillars } from "@/components/home/LearningPillars";
import { CampusNews } from "@/components/home/CampusNews";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { SpotlightGrid } from "@/components/home/SpotlightGrid";
import { VisionMission } from "@/components/home/VisionMission";
import { CampusWallpaperBand } from "@/components/home/CampusWallpaperBand";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollReveal direction="up">
        <Discovery />
      </ScrollReveal>
      <ScrollReveal direction="left">
        <LearningPillars />
      </ScrollReveal>
      <CampusNews />
      <UpcomingEvents />
      <SpotlightGrid />
      <VisionMission />
      <CampusWallpaperBand />
    </>
  );
}
