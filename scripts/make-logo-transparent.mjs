/**
 * Remove outer matte from logo PNG (flood-fill from edges + dark fringe peel).
 * Preserves intentional white/black inside the crest (e.g. wordmark on the ring).
 */
import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const WHITE_THRESHOLD = 245;
const BLACK_THRESHOLD = 40;
/** JPEG/scan fringes around black mattes (e.g. rgb(32,64,141)) stay edge-connected. */
const DARK_MATTE_LUMINANCE = 110;
/** Peel dark anti-alias halos inward from transparent pixels (not crest interior). */
const FRINGE_LUMINANCE = 32;

function isNearWhite(r, g, b, a) {
  return a > 0 && r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
}

function isNearBlack(r, g, b, a) {
  return a > 0 && r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD;
}

function isEdgeMatte(r, g, b, a) {
  if (a === 0) return false;
  if (isNearWhite(r, g, b, a) || isNearBlack(r, g, b, a)) return true;
  return (r + g + b) / 3 < DARK_MATTE_LUMINANCE;
}

function peelDarkFringe(data, width, height) {
  const w = width;
  const h = height;
  const alphaAt = (idx) => data[idx * 4 + 3];
  const isTransparent = (idx) => alphaAt(idx) < 128;
  const isDarkFringe = (idx) => {
    if (alphaAt(idx) < 128) return false;
    const p = idx * 4;
    return (data[p] + data[p + 1] + data[p + 2]) / 3 <= FRINGE_LUMINANCE;
  };

  let changed = true;
  let guard = 0;
  while (changed && guard < 5000) {
    changed = false;
    guard++;
    const toClear = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (!isDarkFringe(idx)) continue;
        const neighbors = [
          x > 0 ? idx - 1 : -1,
          x < w - 1 ? idx + 1 : -1,
          y > 0 ? idx - w : -1,
          y < h - 1 ? idx + w : -1,
        ];
        if (neighbors.some((n) => n >= 0 && isTransparent(n))) toClear.push(idx);
      }
    }
    for (const idx of toClear) {
      data[idx * 4 + 3] = 0;
      changed = true;
    }
  }
}

/**
 * @param {string | Buffer} input
 * @returns {Promise<Buffer>} PNG with edge matte removed
 */
export async function removeEdgeMatte(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function push(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const p = idx * 4;
    if (!isEdgeMatte(data[p], data[p + 1], data[p + 2], data[p + 3])) return;
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

  for (let idx = 0; idx < width * height; idx++) {
    if (!visited[idx]) continue;
    const p = idx * 4;
    data[p + 3] = 0;
  }

  peelDarkFringe(data, width, height);

  return sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, force: true })
    .toBuffer();
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isCli) {
  const input = process.argv[2];
  const output = process.argv[3] ?? join(root, "public/images/logo-lockup.png");

  if (!input) {
    console.error(
      "Usage: node scripts/make-logo-transparent.mjs <input.png> [output.png]",
    );
    process.exit(1);
  }

  const png = await removeEdgeMatte(input);
  await sharp(png).toFile(output);
  console.log(`Saved ${output}`);
}
