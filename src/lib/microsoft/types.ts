/** Microsoft 365 / Graph API shared types */

export type MicrosoftInstitutionalRole = "student" | "lecturer" | "staff" | "unknown";

export type MicrosoftUserProfile = {
  id: string;
  email: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  institutionalRole: MicrosoftInstitutionalRole;
  /** Azure AD group object IDs from token or Graph lookup */
  groupIds?: string[];
};

export type MicrosoftVerifiedIdentity = {
  profile: MicrosoftUserProfile;
  idTokenPayload: Record<string, unknown>;
};

export type MicrosoftSessionData = {
  microsoftUserId: string;
  email: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  institutionalRole: MicrosoftInstitutionalRole;
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresAt: number;
  idToken?: string;
};

export type GraphCalendarEvent = {
  id: string;
  subject: string;
  start: string;
  end: string;
  location?: string;
  organizer?: string;
  isOnlineMeeting: boolean;
  webLink?: string;
};

export type GraphNotice = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  source: "sharepoint" | "calendar" | "mock";
};

export type GraphDriveItem = {
  id: string;
  name: string;
  size: number;
  mimeType?: string;
  webUrl?: string;
  lastModified: string;
  isFolder: boolean;
  childCount?: number;
};

export type MicrosoftGraphBundle = {
  configured: boolean;
  calendarEvents: GraphCalendarEvent[];
  notices: GraphNotice[];
  curriculumItems: GraphDriveItem[];
  error?: string;
};

export type MicrosoftAuthCallbackPayload = {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
};

export type MicrosoftGraphNoticesBundle = {
  configured: boolean;
  authenticated: boolean;
  notices: GraphNotice[];
  curriculumItems: GraphDriveItem[];
  error?: string;
};

export type MicrosoftSessionResponse = {
  authenticated: boolean;
  profile?: MicrosoftUserProfile;
  expiresAt?: number;
  configured: boolean;
};
