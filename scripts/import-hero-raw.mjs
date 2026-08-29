/**
 * Copy user-provided hero masters into public/images/hero/raw/
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const rawDir = path.join(process.cwd(), "public/images/hero/raw");
const assetsDir =
  "C:/Users/joscom/.cursor/projects/c-Users-joscom-Mable-abale-school/assets";

const MASTERS = [
  {
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DPM_3962-339b6100-1306-4207-8731-ec3a7bb446d1.png",
    dest: "clinical-infant-care.jpg",
  },
  {
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_DPM_4018-b385d538-cc09-4770-ae16-6dd5f3903917.png",
    dest: "hospital-ward.jpg",
  },
  {
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_IMG_9580-40e0593c-982b-4219-8605-db73c9a03b58.png",
    dest: "instrument-training.jpg",
  },
  {
    src: "c__Users_joscom_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_IMG_9662-e335b86e-5f1d-4646-a7f0-af0ab15b6259.png",
    dest: "injection-practice.jpg",
  },
];

fs.mkdirSync(rawDir, { recursive: true });

for (const { src, dest } of MASTERS) {
  const input = path.join(assetsDir, src);
  const output = path.join(rawDir, dest);
  await sharp(input)
    .rotate()
    .jpeg({ quality: 98, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(output);
  const meta = await sharp(output).metadata();
  console.log(`${dest} → ${meta.width}x${meta.height}`);
}
