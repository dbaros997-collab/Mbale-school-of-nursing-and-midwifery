/**
 * Re-encode hero photos as high-quality 1920px-wide JPEGs for sharp full-width display.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const heroDir = path.join(process.cwd(), "public/images/hero");
const targetWidth = 1920;

const files = fs.readdirSync(heroDir).filter((f) => /\.(png|jpe?g)$/i.test(f));

for (const file of files) {
  const input = path.join(heroDir, file);
  const base = file.replace(/\.(png|jpe?g)$/i, "");
  const output = path.join(heroDir, `${base}.jpg`);

  const meta = await sharp(input).metadata();
  const pipeline = sharp(input).rotate();

  if ((meta.width ?? 0) < targetWidth) {
    pipeline.resize(targetWidth, null, {
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    });
  }

  await pipeline
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.3 })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(output);

  const outMeta = await sharp(output).metadata();
  const kb = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`${base}.jpg → ${outMeta.width}x${outMeta.height} (${kb} KB)`);

  if (file !== `${base}.jpg`) {
    fs.unlinkSync(input);
  }
}
