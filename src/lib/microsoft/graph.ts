import { getMicrosoftServerConfig, isMicrosoftConfigured } from "./config";
import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";
import { isAccessTokenExpired, refreshMicrosoftAccessToken } from "./token";
import { readMicrosoftSession, saveMicrosoftSession } from "./session";
import type {
  GraphCalendarEvent,
  GraphDriveItem,
  GraphNotice,
  MicrosoftGraphBundle,
  MicrosoftGraphNoticesBundle,
} from "./types";

type GraphListResponse<T> = { value: T[] };

async function getValidAccessToken(): Promise<string | null> {
  const session = await readMicrosoftSession();
  if (!session) return null;

  if (!isAccessTokenExpired(session.accessTokenExpiresAt)) {
    return session.accessToken;
  }

  if (!session.refreshToken) {
    return null;
  }

  try {
    const refreshed = await refreshMicrosoftAccessToken(session.refreshToken);
    await saveMicrosoftSession({
      ...session,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      accessTokenExpiresAt: refreshed.expiresAt,
    });
    return refreshed.accessToken;
  } catch {
    return null;
  }
}

async function graphFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetchWithTimeout(`https://graph.microsoft.com/v1.0${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
    timeoutMs: 12_000,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Graph API ${response.status}: ${body.slice(0, 200)}`);
  }

  return response.json() as Promise<T>;
}

function mockGraphBundle(message?: string): MicrosoftGraphBundle {
  return {
    configured: isMicrosoftConfigured(),
    calendarEvents: [],
    notices: [],
    curriculumItems: [],
    error: message,
  };
}

export async function fetchMicrosoftGraphBundle(): Promise<MicrosoftGraphBundle> {
  if (!isMicrosoftConfigured()) {
    return mockGraphBundle("Microsoft 365 integration is not configured.");
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return mockGraphBundle("Sign in with your Microsoft school account to view institutional data.");
  }

  const config = getMicrosoftServerConfig();
  const now = new Date();
  const horizon = new Date(now);
  horizon.setDate(horizon.getDate() + 14);

  try {
    const [calendarRaw, curriculumItems, notices] = await Promise.all([
      graphFetch<GraphListResponse<Record<string, unknown>>>(
        `/me/calendarview?startDateTime=${encodeURIComponent(now.toISOString())}&endDateTime=${encodeURIComponent(horizon.toISOString())}&$orderby=start/dateTime&$top=12&$select=id,subject,start,end,location,organizer,isOnlineMeeting,webLink`,
        accessToken,
      ),
      fetchCurriculumItems(accessToken, config),
      fetchNotices(accessToken, config),
    ]);

    const calendarEvents: GraphCalendarEvent[] = (calendarRaw.value ?? []).map(mapCalendarEvent);

    return {
      configured: true,
      calendarEvents,
      notices,
      curriculumItems,
    };
  } catch (err) {
    return mockGraphBundle(
      err instanceof Error ? err.message : "Failed to load Microsoft 365 data.",
    );
  }
}

function mapCalendarEvent(raw: Record<string, unknown>): GraphCalendarEvent {
  const start = raw.start as { dateTime?: string } | undefined;
  const end = raw.end as { dateTime?: string } | undefined;
  const location = raw.location as { displayName?: string } | undefined;
  const organizer = raw.organizer as { emailAddress?: { name?: string } } | undefined;

  return {
    id: String(raw.id ?? crypto.randomUUID()),
    subject: String(raw.subject ?? "Untitled event"),
    start: start?.dateTime ?? new Date().toISOString(),
    end: end?.dateTime ?? new Date().toISOString(),
    location: location?.displayName,
    organizer: organizer?.emailAddress?.name,
    isOnlineMeeting: Boolean(raw.isOnlineMeeting),
    webLink: raw.webLink ? String(raw.webLink) : undefined,
  };
}

async function fetchCurriculumItems(
  accessToken: string,
  config: ReturnType<typeof getMicrosoftServerConfig>,
): Promise<GraphDriveItem[]> {
  if (!config.sharePointSiteId && !config.sharePointDriveId) {
    return [];
  }

  const folderPath = config.curriculumFolderPath.replace(/^\/+/, "");
  let path: string;

  if (config.sharePointDriveId) {
    path = `/drives/${config.sharePointDriveId}/root:/${folderPath}:/children?$select=id,name,size,file,webUrl,lastModifiedDateTime,folder`;
  } else {
    path = `/sites/${config.sharePointSiteId}/drive/root:/${folderPath}:/children?$select=id,name,size,file,webUrl,lastModifiedDateTime,folder`;
  }

  const data = await graphFetch<GraphListResponse<Record<string, unknown>>>(path, accessToken);
  return (data.value ?? []).map(mapDriveItem);
}

function mapDriveItem(raw: Record<string, unknown>): GraphDriveItem {
  const file = raw.file as { mimeType?: string } | undefined;
  const folder = raw.folder as { childCount?: number } | undefined;

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? "Untitled"),
    size: Number(raw.size ?? 0),
    mimeType: file?.mimeType,
    webUrl: raw.webUrl ? String(raw.webUrl) : undefined,
    lastModified: String(raw.lastModifiedDateTime ?? new Date().toISOString()),
    isFolder: Boolean(folder),
    childCount: folder?.childCount,
  };
}

async function fetchNotices(
  accessToken: string,
  config: ReturnType<typeof getMicrosoftServerConfig>,
): Promise<GraphNotice[]> {
  if (config.noticesListId && config.sharePointSiteId) {
    try {
      const data = await graphFetch<GraphListResponse<Record<string, unknown>>>(
        `/sites/${config.sharePointSiteId}/lists/${config.noticesListId}/items?expand=fields&$top=20&$orderby=lastModifiedDateTime desc`,
        accessToken,
      );

      return (data.value ?? []).map((item) => {
        const fields = (item.fields ?? {}) as Record<string, unknown>;
        return {
          id: String(item.id ?? crypto.randomUUID()),
          title: String(fields.Title ?? fields.title ?? "Notice"),
          body: String(fields.Body ?? fields.Description ?? fields.description ?? ""),
          publishedAt: String(
            fields.PublishedDate ?? fields.Created ?? item.lastModifiedDateTime ?? new Date().toISOString(),
          ),
          source: "sharepoint" as const,
        };
      });
    } catch {
      return [];
    }
  }

  return [];
}

export async function fetchMicrosoftNoticesBundle(): Promise<MicrosoftGraphNoticesBundle> {
  if (!isMicrosoftConfigured()) {
    return {
      configured: false,
      authenticated: false,
      notices: [],
      curriculumItems: [],
      error: "Microsoft 365 integration is not configured.",
    };
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return {
      configured: true,
      authenticated: false,
      notices: [],
      curriculumItems: [],
      error: "Sign in with your Microsoft school account to view SharePoint notices and curriculum files.",
    };
  }

  const config = getMicrosoftServerConfig();

  try {
    const [notices, curriculumItems] = await Promise.all([
      fetchNotices(accessToken, config),
      fetchCurriculumItems(accessToken, config),
    ]);

    return {
      configured: true,
      authenticated: true,
      notices,
      curriculumItems: curriculumItems.filter((item) => !item.isFolder),
    };
  } catch (err) {
    return {
      configured: true,
      authenticated: true,
      notices: [],
      curriculumItems: [],
      error: err instanceof Error ? err.message : "Failed to load SharePoint notices.",
    };
  }
}

export async function fetchDriveItemPreviewUrl(itemId: string): Promise<string | null> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) return null;

  const config = getMicrosoftServerConfig();
  const drivePrefix = config.sharePointDriveId
    ? `/drives/${config.sharePointDriveId}`
    : config.sharePointSiteId
      ? `/sites/${config.sharePointSiteId}/drive`
      : null;

  if (!drivePrefix) return null;

  try {
    const item = await graphFetch<Record<string, unknown>>(
      `${drivePrefix}/items/${itemId}?$select=id,name,webUrl,file`,
      accessToken,
    );

    if (item.webUrl) return String(item.webUrl);

    const content = await fetchWithTimeout(`https://graph.microsoft.com/v1.0${drivePrefix}/items/${itemId}/content`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      redirect: "follow",
      timeoutMs: 15_000,
    });

    return content.url || null;
  } catch {
    return null;
  }
}

export async function streamDriveItemContent(itemId: string) {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return { ok: false as const, status: 401, message: "Not authenticated with Microsoft." };
  }

  const config = getMicrosoftServerConfig();
  const drivePrefix = config.sharePointDriveId
    ? `/drives/${config.sharePointDriveId}`
    : config.sharePointSiteId
      ? `/sites/${config.sharePointSiteId}/drive`
      : null;

  if (!drivePrefix) {
    return { ok: false as const, status: 503, message: "SharePoint drive is not configured." };
  }

  const meta = await graphFetch<Record<string, unknown>>(
    `${drivePrefix}/items/${itemId}?$select=id,name,file`,
    accessToken,
  );

  const file = meta.file as { mimeType?: string } | undefined;
  const response = await fetchWithTimeout(`https://graph.microsoft.com/v1.0${drivePrefix}/items/${itemId}/content`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeoutMs: 30_000,
  });

  if (!response.ok) {
    return { ok: false as const, status: response.status, message: "Unable to download file." };
  }

  return {
    ok: true as const,
    body: response.body,
    contentType: file?.mimeType ?? response.headers.get("content-type") ?? "application/octet-stream",
    fileName: String(meta.name ?? "document"),
  };
}
