/** Aerial campus photo for Apply band + footer (cache-busted on visual updates). */
export const FOOTER_SECTION_BG = "/images/footer-section-bg.jpg?v=fog6";

export function footerSectionPhoto(): string {
  return `url('${FOOTER_SECTION_BG}')`;
}
