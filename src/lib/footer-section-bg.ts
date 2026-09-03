/** Aerial campus photo — footer subscribe + links section only. */
export const FOOTER_SECTION_BG = "/images/footer-section-bg.png?v=footer-only";

/** Apply for admission band — separate campus photo, not shared with footer. */
export const APPLY_BAND_BG = "/images/footer-section-bg.jpg?v=apply-band";

export function footerSectionPhoto(): string {
  return `url('${FOOTER_SECTION_BG}')`;
}
