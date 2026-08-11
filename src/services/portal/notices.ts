import { MOCK_ANNOUNCEMENTS } from "@/lib/portal/mock-store";
import type { Announcement } from "@/lib/portal/schema";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type NoticesBundle = {
  announcements: Announcement[];
  headline: Announcement | null;
};

/** Ready for GET /api/portal/notices */
export async function getNoticesBundle(): Promise<NoticesBundle> {
  await delay(220);
  const announcements = [...MOCK_ANNOUNCEMENTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return {
    announcements,
    headline: announcements[0] ?? null,
  };
}
