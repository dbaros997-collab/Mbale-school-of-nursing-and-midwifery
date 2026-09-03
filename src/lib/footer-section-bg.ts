/** Footer subscribe + links section background — students celebration photo. */
export const FOOTER_SECTION_BG = "/images/footer-students-celebration.png?v=1";

/** Apply for admission band — separate campus photo, not shared with footer. */
export const APPLY_BAND_BG = "/images/footer-section-bg.jpg?v=apply-band";

export function footerSectionPhoto(): string {
  return `url('${FOOTER_SECTION_BG}')`;
}
