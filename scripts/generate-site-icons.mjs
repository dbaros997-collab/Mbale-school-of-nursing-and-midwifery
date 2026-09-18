/**
 * Build favicon + Apple touch icons from public/images/logo-lockup.png.
 * Run: node scripts/generate-site-icons.mjs
 */
import sharp from "sharp";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
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
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

const targets = [
  [32, join(root, "public/icons/site-icon-32.png")],
  [48, join(root, "public/icons/site-icon-48.png")],
  [96, join(root, "public/icons/site-icon-96.png")],
  [180, join(root, "public/apple-touch-icon.png")],
  [192, join(root, "public/icons/site-icon-192.png")],
  [32, join(root, "src/app/icon.png")],
  [180, join(root, "src/app/apple-icon.png")],
];

for (const [size, path] of targets) {
  await writeSquareIcon(size, path);
  console.log(`Wrote ${path} (${size}x${size})`);
}

const favicon32 = join(root, "public/icons/site-icon-32.png");
const favicon48 = join(root, "public/icons/site-icon-48.png");
const faviconIco = join(root, "public/favicon.ico");
const faviconApp = join(root, "src/app/favicon.ico");

const icoBuffer = execSync(
  `npx --yes png-to-ico "${favicon32}" "${favicon48}"`,
  { cwd: root, encoding: "buffer", stdio: ["ignore", "pipe", "inherit"], shell: true },
);
writeFileSync(faviconIco, icoBuffer);
writeFileSync(faviconApp, icoBuffer);
console.log(`Wrote ${faviconIco} and ${faviconApp}`);

const publicLogo = join(root, "public/school-logo.png");
await sharp(source).png({ compressionLevel: 9 }).toFile(publicLogo);
console.log(`Wrote ${publicLogo}`);
