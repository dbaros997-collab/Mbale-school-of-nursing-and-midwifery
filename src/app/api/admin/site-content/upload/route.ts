import { promises as fs } from "fs";
import path from "path";
import { withAdminSiteContentAccess } from "@/lib/api/admin-site-content-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "site");
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeBaseName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function POST(request: Request) {
  return withAdminSiteContentAccess(async () => {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { ok: false, message: "Choose an image file to upload." },
        { status: 400, headers: NO_STORE },
      );
    }

    if (!ALLOWED.has(file.type)) {
      return Response.json(
        { ok: false, message: "Use JPEG, PNG, WebP, or GIF images only." },
        { status: 400, headers: NO_STORE },
      );
    }

    if (file.size > MAX_BYTES) {
      return Response.json(
        { ok: false, message: "Image must be 8 MB or smaller." },
        { status: 400, headers: NO_STORE },
      );
    }

    const ext =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "gif";

    const base = safeBaseName(file.name) || "photo";
    const filename = `${Date.now()}-${base}.${ext}`;
    const diskPath = path.join(UPLOAD_DIR, filename);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(diskPath, bytes);

    const url = `/uploads/site/${filename}`;
    return Response.json({ ok: true, url, filename }, { headers: NO_STORE });
  });
}
