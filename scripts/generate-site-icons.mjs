/**
 * Build crest PNGs + favicons from public/images/school-crest-source.png.
 * Run: node scripts/generate-site-icons.mjs
 *
 * Icons stay in public/ only — do not add src/app/favicon.ico or Next injects a
 * hashed /favicon.ico route that overrides these PNG links in the tab UI.
 */
import sharp from "sharp";
import toIco from "to-ico";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { removeEdgeMatte } from "./make-logo-transparent.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public/images/school-crest-source.png");
const lockup = join(root, "public/images/logo-lockup.png");
const footerLockup = join(root, "public/images/footer-mbsnm-lockup.png");

let crestPng = await removeEdgeMatte(source);
crestPng = await sharp(crestPng)
  .trim({ threshold: 10 })
  .png({ compressionLevel: 9, force: true })
  .toBuffer();
const crestMeta = await sharp(crestPng).metadata();
if (!crestMeta.hasAlpha) {
  throw new Error("logo-lockup must have alpha after matte removal");
}
writeFileSync(lockup, crestPng);
writeFileSync(footerLockup, crestPng);
console.log(
  `Wrote ${lockup} (transparent, ${crestMeta.width}x${crestMeta.height})`,
);
console.log(`Wrote ${footerLockup} (transparent)`);

const crestSvg = join(root, "public/images/logo-crest.svg");
const svgMarkup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${crestMeta.width} ${crestMeta.height}" role="img" aria-label="Mbale School of Nursing and Midwifery">
  <image href="data:image/png;base64,${crestPng.toString("base64")}" width="${crestMeta.width}" height="${crestMeta.height}"/>
</svg>
`;
writeFileSync(crestSvg, svgMarkup);
console.log(`Wrote ${crestSvg} (embedded transparent PNG)`);

async function writeSquareIcon(size, outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(crestPng)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png({
      compressionLevel: 9,
      palette: size <= 16,
      effort: size >= 192 ? 10 : 7,
    })
    .toFile(outputPath);
}

const targets = [
  [16, join(root, "public/icons/site-icon-16.png")],
  [32, join(root, "public/icons/site-icon-32.png")],
  [48, join(root, "public/icons/site-icon-48.png")],
  [96, join(root, "public/icons/site-icon-96.png")],
  [180, join(root, "public/apple-touch-icon.png")],
  [192, join(root, "public/icons/site-icon-192.png")],
  [512, join(root, "public/icons/site-icon-512.png")],
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
const publicLogoImages = join(root, "public/images/school-logo.png");
await sharp(crestPng).png({ compressionLevel: 9 }).toFile(publicLogo);
await sharp(crestPng).png({ compressionLevel: 9 }).toFile(publicLogoImages);
console.log(`Wrote ${publicLogo}`);
console.log(`Wrote ${publicLogoImages}`);
