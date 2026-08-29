/**
 * KIU-style hero assets: 1920×830 WebP (desktop) + 1280×554 WebP (mobile).
 * Fixed banner ratio keeps photos sharp — no full-viewport stretch.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const heroDir = path.join(process.cwd(), "public/images/hero");
const DESKTOP = { width: 1920, height: 830 };
const MOBILE = { width: 1280, height: 554 };

const sources = fs
  .readdirSync(heroDir)
  .filter((f) => /\.(jpe?g|webp)$/i.test(f) && !f.includes("-1280"));

for (const file of sources) {
  const input = path.join(heroDir, file);
  const base = file.replace(/\.(jpe?g|webp)$/i, "");
  const desktopOut = path.join(heroDir, `${base}.webp`);
  const mobileOut = path.join(heroDir, `${base}-1280.webp`);

  const pipeline = (width, height, out) =>
    sharp(input)
      .rotate()
      .resize(width, height, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 0.6, m1: 0.45, m2: 0.25 })
      .webp({ quality: 88, effort: 4 })
      .toFile(out);

  await pipeline(DESKTOP.width, DESKTOP.height, desktopOut);
  await pipeline(MOBILE.width, MOBILE.height, mobileOut);

  const desktopKb = (fs.statSync(desktopOut).size / 1024).toFixed(0);
  const mobileKb = (fs.statSync(mobileOut).size / 1024).toFixed(0);
  console.log(`${base}.webp → ${DESKTOP.width}x${DESKTOP.height} (${desktopKb} KB)`);
  console.log(`${base}-1280.webp → ${MOBILE.width}x${MOBILE.height} (${mobileKb} KB)`);

  if (!file.endsWith(".webp")) {
    fs.unlinkSync(input);
  }
}
