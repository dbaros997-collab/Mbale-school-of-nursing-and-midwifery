import type { Announcement } from "@/lib/portal/schema";

export type NoticesBundle = {
  announcements: Announcement[];
  headline: Announcement | null;
};

export async function getNoticesBundle(): Promise<NoticesBundle> {
  return { announcements: [], headline: null };
}
