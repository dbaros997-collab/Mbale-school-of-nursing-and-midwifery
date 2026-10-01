/** Bust CDN/browser cache when a new build deploys. */
export const HERO_ASSET_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "hero-v6-compact";

export function heroAsset(path: string) {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${HERO_ASSET_VERSION}`;
}
