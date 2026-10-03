import { Hero } from "@/components/home/Hero";
import { Discovery } from "@/components/home/Discovery";
import { LearningPillars } from "@/components/home/LearningPillars";
import { CampusNews } from "@/components/home/CampusNews";
import { SchoolGallery } from "@/components/home/SchoolGallery";
import { SpotlightGrid } from "@/components/home/SpotlightGrid";
import { VisionMission } from "@/components/home/VisionMission";
import { AboutBand } from "@/components/home/AboutBand";
import { ApplyBand } from "@/components/home/ApplyBand";
import { CampusMapSection } from "@/components/home/CampusMapSection";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { marketingPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content/queries";

export const metadata = marketingPageMetadata("/", {
  title: "Welcome",
  description:
    "Mbale School of Nursing and Midwifery — nursing and midwifery training in Eastern Uganda. Accredited programmes, clinical placements, and student portal.",
});

export default async function HomePage() {
  const { galleryItems, spotlightArticles } = await getSiteContent();

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
      <SchoolGallery items={galleryItems} />
      <SpotlightGrid articles={spotlightArticles} />
      <VisionMission />
      <ScrollReveal direction="up">
        <CampusMapSection />
      </ScrollReveal>
      <ApplyBand />
      <Footer />
    </>
  );
}
