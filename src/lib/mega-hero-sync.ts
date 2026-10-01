export const MEGA_HERO_SYNC_EVENT = "mbsnm-mega-hero-sync";

export function dispatchMegaHeroSync(image: string) {
  window.dispatchEvent(
    new CustomEvent(MEGA_HERO_SYNC_EVENT, { detail: { image } }),
  );
}
