/**
 * Remove outer white matte from logo PNG (flood-fill from edges).
 * Preserves intentional white inside the crest and wordmark.
 */
import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const input = process.argv[2];
const output = process.argv[3] ?? join(root, "public/images/logo-lockup.png");

if (!input) {
  console.error("Usage: node scripts/make-logo-transparent.mjs <input.png> [output.png]");
  process.exit(1);
}

const WHITE_THRESHOLD = 245;

function isNearWhite(r, g, b, a) {
  return a > 0 && r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const { width, height } = info;
const visited = new Uint8Array(width * height);
const queue = [];

function push(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const idx = y * width + x;
  if (visited[idx]) return;
  const p = idx * 4;
  if (!isNearWhite(data[p], data[p + 1], data[p + 2], data[p + 3])) return;
  visited[idx] = 1;
  queue.push(idx);
}

for (let x = 0; x < width; x++) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y++) {
  push(0, y);
  push(width - 1, y);
}

while (queue.length > 0) {
  const idx = queue.pop();
  const x = idx % width;
  const y = (idx - x) / width;
  push(x - 1, y);
  push(x + 1, y);
  push(x, y - 1);
  push(x, y + 1);
}

let cleared = 0;
for (let idx = 0; idx < width * height; idx++) {
  if (!visited[idx]) continue;
  const p = idx * 4;
  data[p + 3] = 0;
  cleared++;
}

await sharp(data, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(output);

console.log(`Saved ${output} (${width}x${height}, cleared ${cleared} matte pixels)`);
