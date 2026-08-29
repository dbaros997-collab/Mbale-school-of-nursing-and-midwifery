/**
 * Refresh hero raw masters from mbsnm.org (highest resolution available).
 */
import fs from "node:fs";
import path from "node:path";

const rawDir = path.join(process.cwd(), "public/images/hero/raw");

const SOURCES = {
  "campus-aerial-wide.jpg": "https://mbsnm.org/sitepad-data/uploads/2024/11/ariel.jpg",
  "campus-building.jpg":
    "https://mbsnm.org/sitepad-data/uploads/2024/11/front-offices-1.jpg",
  "students-celebration.jpg":
    "https://mbsnm.org/sitepad-data/uploads/2024/11/march.jpg",
  "clinical-training.jpg":
    "https://mbsnm.org/sitepad-data/uploads/2024/11/computerlab-1.jpg",
};

fs.mkdirSync(rawDir, { recursive: true });

for (const [filename, url] of Object.entries(SOURCES)) {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`Failed ${url}: ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(rawDir, filename), buf);
  console.log(`Saved ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log("campus-mountains.jpg kept as-is (no higher-res source on mbsnm.org)");
