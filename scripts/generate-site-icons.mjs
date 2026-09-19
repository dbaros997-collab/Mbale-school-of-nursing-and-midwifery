/**
 * Build favicon + Apple touch icons from public/images/logo-lockup.png.
 * Run: node scripts/generate-site-icons.mjs
 *
 * Icons live under public/ only (not src/app/*) so Next.js does not inject a
 * competing /favicon.ico?hash metadata route ahead of our explicit <link> tags.
 */
import sharp from "sharp";
import toIco from "to-ico";
import { readFileSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public/images/school-crest-source.png");

async function writeSquareIcon(size, outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(source)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
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

const favicon16 = join(root, "public/icons/site-icon-16.png");
const favicon32 = join(root, "public/icons/site-icon-32.png");
const favicon48 = join(root, "public/icons/site-icon-48.png");
const faviconIco = join(root, "public/favicon.ico");

const icoBuffer = await toIco([
  readFileSync(favicon16),
  readFileSync(favicon32),
  readFileSync(favicon48),
]);
writeFileSync(faviconIco, icoBuffer);
console.log(`Wrote ${faviconIco} (${icoBuffer.length} bytes)`);

const publicLogo = join(root, "public/school-logo.png");
await sharp(source).png({ compressionLevel: 9 }).toFile(publicLogo);
console.log(`Wrote ${publicLogo}`);
