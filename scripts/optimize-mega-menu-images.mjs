/**
 * Mega menu wallpapers — 1920px wide covers (never upscaled beyond source pixels).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public/images/gallery/mega");
const BANNER = { width: 1920, height: 1080 };

/** output filename → source relative to public/ */
const WALLPAPERS = {
  "about-campus.jpg": "images/footer-aerial-valley-hq.jpg",
  "courses-students.jpg": "images/footer-campus-building.jpg",
  "students-campus.jpg": "images/footer-campus-wide.jpg",
  "news-graduation.jpg": "images/footer-section-bg.jpg",
  "quicklinks-campus.jpg": "images/campus-wallpaper.jpg",
};

fs.mkdirSync(outDir, { recursive: true });

async function writeWallpaper(filename, publicRelative) {
  const input = path.join(process.cwd(), "public", publicRelative);
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing: ${publicRelative}`);
    return;
  }

  const meta = await sharp(input).rotate().metadata();
  const srcW = meta.width ?? BANNER.width;
  const srcH = meta.height ?? BANNER.height;
  const outW = Math.min(srcW, BANNER.width);
  const outH = Math.min(srcH, Math.round((outW / BANNER.width) * BANNER.height));
  const targetH = Math.min(outH, BANNER.height);

  const outPath = path.join(outDir, filename);
  await sharp(input)
    .rotate()
    .resize(outW, targetH, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 93,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
      progressive: true,
    })
    .toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`${filename} ← ${publicRelative} → ${outMeta.width}x${outMeta.height} (${kb} KB)`);
}

for (const [name, src] of Object.entries(WALLPAPERS)) {
  await writeWallpaper(name, src);
}
