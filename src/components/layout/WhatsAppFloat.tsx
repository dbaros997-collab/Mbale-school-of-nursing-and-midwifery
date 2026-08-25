import { SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";

export function WhatsAppFloat() {
  return (
    <a
      href={schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#1ebe57] focus-ring sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
