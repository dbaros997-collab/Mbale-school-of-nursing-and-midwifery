/**
 * Course card photos from user-provided DPM / campus masters.
 * Outputs public/images/programs/{id}.jpg (+ .webp) for the academics page.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir =
  "C:/Users/joscom/.cursor/projects/c-Users-joscom-Mable-abale-school/assets";
const outDir = path.join(process.cwd(), "public/images/programs");

/** Card sidebar aspect — 2× desktop column for retina, capped at source pixels */
const CARD = { width: 1024, height: 732 };

const PROGRAMS = [
  {
    id: "diploma-nursing-direct",
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DPM_4018-ebcef9dc-b6fe-4b1a-9e65-9a86427f238a.png",
  },
  {
    id: "diploma-nursing-extension",
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_IMG_9580-40e0593c-982b-4219-8605-db73c9a03b58.png",
  },
  {
    id: "certificate-nursing",
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DPM_3950-654d973f-f02f-45f5-9520-72efec2624ca.png",
  },
  {
    id: "diploma-midwifery-direct",
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DPM_3962-339b6100-1306-4207-8731-ec3a7bb446d1.png",
  },
  {
    id: "diploma-midwifery-extension",
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DPM_3975-b4dbebbf-d3be-4790-b066-ba2fdefb9f86.png",
  },
  {
    id: "certificate-midwifery",
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_IMG_9662-e335b86e-5f1d-4646-a7f0-af0ab15b6259.png",
  },
];

fs.mkdirSync(outDir, { recursive: true });

for (const { id, src } of PROGRAMS) {
  const input = path.join(assetsDir, src);
  if (!fs.existsSync(input)) {
    console.error(`Missing source: ${src}`);
    process.exit(1);
  }

  const pipeline = sharp(input)
    .rotate()
    .resize(CARD.width, CARD.height, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    });

  const jpgOut = path.join(outDir, `${id}.jpg`);
  const webpOut = path.join(outDir, `${id}.webp`);

  await pipeline
    .clone()
    .jpeg({ quality: 98, mozjpeg: true, chromaSubsampling: "4:4:4", progressive: true })
    .toFile(jpgOut);

  await pipeline.clone().webp({ quality: 95, effort: 6, smartSubsample: false }).toFile(webpOut);

  console.log(
    `${id} → jpg ${(fs.statSync(jpgOut).size / 1024).toFixed(0)} KB, webp ${(fs.statSync(webpOut).size / 1024).toFixed(0)} KB`,
  );
}
