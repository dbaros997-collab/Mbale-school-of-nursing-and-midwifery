import Link from "next/link";
import { SCHOOL, schoolGoogleMapsUrl, schoolMapEmbedUrl } from "@/lib/data";
import { cn } from "@/lib/utils";

type CampusMapPanelProps = {
  className?: string;
  id?: string;
};

/** Google Maps embed + directions for the Malere campus. */
export function CampusMapPanel({ className, id }: CampusMapPanelProps) {
  return (
    <div id={id} className={cn("overflow-hidden rounded-3xl content-panel scroll-mt-24", className)}>
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <h3 className="font-bold text-primary">Campus map</h3>
        <p className="mt-1 text-sm text-muted">{SCHOOL.address}</p>
        <p className="mt-3 text-sm leading-relaxed text-primary">
          <span className="font-semibold">From Mbale town: </span>
          {SCHOOL.directionsFromMbaleTown}
        </p>
        <Link
          href={schoolGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-accent-green hover:underline"
        >
          Open in Google Maps
        </Link>
      </div>
      <div className="relative aspect-[16/10] bg-surface">
        <iframe
          title={`Google Maps — ${SCHOOL.name} campus location`}
          src={schoolMapEmbedUrl()}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
