/** Aerial campus photo for Apply band + footer (cache-busted on visual updates). */
export const FOOTER_SECTION_BG = "/images/footer-section-bg.jpg?v=fog4";

/** Light fog tint — photo stays visible; no full-section blur. */
export const FOOTER_SECTION_FOG =
  "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(22,53,127,0.36) 55%, rgba(14,36,86,0.5) 100%)";

export function footerSectionBackgroundImage(): string {
  return `${FOOTER_SECTION_FOG}, url('${FOOTER_SECTION_BG}')`;
}
