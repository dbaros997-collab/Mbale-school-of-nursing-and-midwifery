/**
 * Hero banners from public/images/hero/raw/*.jpg
 * One cover crop per slide — never upscaled beyond source pixels.
 * Outputs matching .webp + .jpg at banner aspect (1920:830).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const rawDir = path.join(process.cwd(), "public/images/hero/raw");
const outDir = path.join(process.cwd(), "public/images/hero");
const BANNER = { width: 1920, height: 830 };
const BANNER_AR = BANNER.width / BANNER.height;

/** raw filename → output base name (without extension) */
const SLIDES = {
  "clinical-infant-care.jpg": "hero-clinical-infant-care",
  "hospital-ward.jpg": "hero-hospital-ward",
  "instrument-training.jpg": "hero-instrument-training",
  "injection-practice.jpg": "hero-injection-practice",
  "clinical-training.jpg": "hero-clinical-training",
};

function buildPipeline(input) {
  return sharp(input).rotate();
}

async function writeBanner(input, base) {
  const meta = await buildPipeline(input).metadata();
  const srcW = meta.width ?? BANNER.width;
  const srcH = meta.height ?? BANNER.height;
  const outW = Math.min(srcW, BANNER.width);
  const outH = Math.round(outW / BANNER_AR);

  const pipeline = buildPipeline(input).resize(outW, outH, {
    fit: "cover",
    position: "centre",
    kernel: sharp.kernel.lanczos3,
    withoutEnlargement: true,
  });

  const jpgOut = path.join(outDir, `${base}.jpg`);
  const webpOut = path.join(outDir, `${base}.webp`);

  await pipeline
    .clone()
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4", progressive: true })
    .toFile(jpgOut);

  await pipeline
    .clone()
    .webp({ quality: 90, effort: 6, smartSubsample: false })
    .toFile(webpOut);

  const outMeta = await sharp(jpgOut).metadata();
  console.log(
    `${base} → ${outMeta.width}x${outMeta.height} jpg ${(fs.statSync(jpgOut).size / 1024).toFixed(0)} KB, webp ${(fs.statSync(webpOut).size / 1024).toFixed(0)} KB`,
  );

  return { width: outMeta.width ?? outW, height: outMeta.height ?? outH };
}

for (const [rawFile, base] of Object.entries(SLIDES)) {
  const input = path.join(rawDir, rawFile);
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing raw: ${rawFile}`);
    continue;
  }
  await writeBanner(input, base);
}

for (const f of fs.readdirSync(outDir)) {
  if (f.endsWith("-sharp.jpg") || f.endsWith("-sharp.webp")) {
    fs.unlinkSync(path.join(outDir, f));
  }
}
