/** Aerial campus photo for Apply band + footer (cache-busted on visual updates). */
export const FOOTER_SECTION_BG = "/images/footer-section-bg.jpg?v=fog5";

/** Light fog tint — campus buildings stay visible through the mist. */
export const FOOTER_SECTION_FOG =
  "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(22,53,127,0.28) 55%, rgba(14,36,86,0.42) 100%)";

export function footerSectionBackgroundImage(): string {
  return `${FOOTER_SECTION_FOG}, url('${FOOTER_SECTION_BG}')`;
}
