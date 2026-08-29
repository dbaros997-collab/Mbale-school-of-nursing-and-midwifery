/**
 * Hero masters from public/images/hero/raw/*.jpg
 * - *-sharp.jpg  native crop (never upscaled — pixel-sharp foreground)
 * - *.jpg         1920×830 background fill (soft blur applied in CSS)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const rawDir = path.join(process.cwd(), "public/images/hero/raw");
const outDir = path.join(process.cwd(), "public/images/hero");
const BANNER = { width: 1920, height: 830 };
const SHARP_MAX = 1024;

/** raw filename → output base name (without extension) */
const SLIDES = {
  "campus-aerial-wide.jpg": "hero-campus-aerial-wide",
  "campus-mountains.jpg": "hero-campus-mountains",
  "campus-building.jpg": "hero-campus-building",
  "students-celebration.jpg": "hero-students-celebration",
  "clinical-training.jpg": "hero-clinical-training",
};

for (const [rawFile, base] of Object.entries(SLIDES)) {
  const input = path.join(rawDir, rawFile);
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing raw: ${rawFile}`);
    continue;
  }

  const sharpOut = path.join(outDir, `${base}-sharp.jpg`);
  const bgOut = path.join(outDir, `${base}.jpg`);

  const meta = await sharp(input).metadata();
  const srcW = meta.width ?? SHARP_MAX;
  const sharpW = Math.min(srcW, SHARP_MAX);
  const sharpH = Math.round((sharpW * BANNER.height) / BANNER.width);

  await sharp(input)
    .rotate()
    .resize(sharpW, sharpH, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    })
    .sharpen({ sigma: 0.45, m1: 0.4, m2: 0.2 })
    .jpeg({ quality: 98, mozjpeg: true, chromaSubsampling: "4:4:4", progressive: true })
    .toFile(sharpOut);

  await sharp(input)
    .rotate()
    .resize(BANNER.width, BANNER.height, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .jpeg({ quality: 85, mozjpeg: true, progressive: true })
    .toFile(bgOut);

  const sMeta = await sharp(sharpOut).metadata();
  console.log(`${base}-sharp.jpg → ${sMeta.width}x${sMeta.height} (${(fs.statSync(sharpOut).size / 1024).toFixed(0)} KB)`);
  console.log(`${base}.jpg → bg ${BANNER.width}x${BANNER.height} (${(fs.statSync(bgOut).size / 1024).toFixed(0)} KB)`);
}

for (const f of fs.readdirSync(outDir)) {
  if (f.endsWith(".webp")) fs.unlinkSync(path.join(outDir, f));
}
