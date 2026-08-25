import { mockDelay } from "@/lib/mock-delay";
import { MOCK_ANNOUNCEMENTS } from "@/lib/portal/mock-store";
import type { Announcement } from "@/lib/portal/schema";

export type NoticesBundle = {
  announcements: Announcement[];
  headline: Announcement | null;
};

/** Ready for GET /api/portal/notices */
export async function getNoticesBundle(): Promise<NoticesBundle> {
  await mockDelay(220);
  const announcements = [...MOCK_ANNOUNCEMENTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return {
    announcements,
    headline: announcements[0] ?? null,
  };
}
