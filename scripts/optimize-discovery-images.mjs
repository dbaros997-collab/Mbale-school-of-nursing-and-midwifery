import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public/images/discovery");
fs.mkdirSync(outDir, { recursive: true });

const assets = path.join(
  process.env.USERPROFILE ?? "",
  ".cursor/projects/c-Users-joscom-Mable-abale-school/assets",
);

const items = [
  {
    src: path.join(assets, "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DJI_0212-6785ee90-778a-4173-8797-3e5f33eb2770.png"),
    name: "about",
  },
  {
    src: path.join(assets, "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DPM_4001-11a0b117-34de-4bd7-8677-034ac1e3c539.png"),
    name: "programs",
  },
  {
    src: path.join(assets, "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_IMG_9610-3f1ad33a-4249-44a5-9e53-29ef9b0a38bb.png"),
    name: "online",
  },
  {
    src: path.join(assets, "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_IMG_9252-33dc7c3e-e458-4881-9fee-c09308286270.png"),
    name: "career",
  },
];

for (const item of items) {
  const pipeline = sharp(item.src)
    .rotate()
    .resize(960, 384, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.5 });

  const jpgOut = path.join(outDir, `discovery-${item.name}.jpg`);
  const webpOut = path.join(outDir, `discovery-${item.name}.webp`);

  await pipeline
    .clone()
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4", progressive: true })
    .toFile(jpgOut);

  await pipeline.clone().webp({ quality: 90, effort: 6 }).toFile(webpOut);

  console.log(
    `${item.name} → jpg ${(fs.statSync(jpgOut).size / 1024).toFixed(0)} KB, webp ${(fs.statSync(webpOut).size / 1024).toFixed(0)} KB`,
  );
}
