import { Hero } from "@/components/home/Hero";
import { Discovery } from "@/components/home/Discovery";
import { LearningPillars } from "@/components/home/LearningPillars";
import { CampusNews } from "@/components/home/CampusNews";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { SchoolGallery } from "@/components/home/SchoolGallery";
import { SpotlightGrid } from "@/components/home/SpotlightGrid";
import { VisionMission } from "@/components/home/VisionMission";
import { AboutBand } from "@/components/home/AboutBand";
import { ApplyBand } from "@/components/home/ApplyBand";
import { Footer } from "@/components/layout/Footer";
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
      <AboutBand />
      <CampusNews />
      <UpcomingEvents />
      <SchoolGallery />
      <SpotlightGrid />
      <VisionMission />
      <ApplyBand />
      <Footer />
    </>
  );
}
