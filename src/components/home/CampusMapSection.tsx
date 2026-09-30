import { CampusMapPanel } from "@/components/marketing/CampusMapPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CampusMapSection() {
  return (
    <section className="section-surface scroll-mt-24 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Visit us"
          title="Find our campus"
          description="Malere campus, behind Forest Road — use the map for directions from Mbale town."
          className="mb-8"
        />
        <CampusMapPanel id="campus-map" />
      </div>
    </section>
  );
}
