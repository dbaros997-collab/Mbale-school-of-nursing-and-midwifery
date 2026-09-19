/**
 * Build favicon + Apple touch icons from public/images/logo-lockup.png.
 * Run: node scripts/generate-site-icons.mjs
 *
 * Icons live under public/ only (not src/app/*) so Next.js does not inject a
 * competing /favicon.ico?hash metadata route ahead of our explicit <link> tags.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public/images/logo-lockup.png");

async function writeSquareIcon(size, outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(source)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png({ compressionLevel: 9, palette: size <= 48 })
    .toFile(outputPath);
}

const targets = [
  [16, join(root, "public/icons/site-icon-16.png")],
  [32, join(root, "public/icons/site-icon-32.png")],
  [48, join(root, "public/icons/site-icon-48.png")],
  [96, join(root, "public/icons/site-icon-96.png")],
  [180, join(root, "public/apple-touch-icon.png")],
  [192, join(root, "public/icons/site-icon-192.png")],
];

for (const [size, path] of targets) {
  await writeSquareIcon(size, path);
  console.log(`Wrote ${path} (${size}x${size})`);
}

// /favicon.ico is redirected to site-icon-48.png in next.config.ts (png-to-ico produced oversized ICOs).
console.log("favicon.ico → /icons/site-icon-48.png (see next.config redirects)");

const publicLogo = join(root, "public/school-logo.png");
await sharp(source).png({ compressionLevel: 9 }).toFile(publicLogo);
console.log(`Wrote ${publicLogo}`);
