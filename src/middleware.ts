import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isLegacyMarketingHost,
  isLegacyStudentAdminHost,
  isOfficialSiteWwwHost,
  normalizeRequestHost,
  officialSiteUrl,
  STAFF_ADMIN_PATH,
} from "@/lib/site-url";

const PERMANENT_REDIRECT = 308;

function redirectToOfficial(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname + request.nextUrl.search;
  return NextResponse.redirect(officialSiteUrl(path), PERMANENT_REDIRECT);
}

export function middleware(request: NextRequest) {
  const host = normalizeRequestHost(request.headers.get("host"));
  if (!host) {
    return NextResponse.next();
  }

  if (isLegacyStudentAdminHost(host)) {
    const target = officialSiteUrl(STAFF_ADMIN_PATH);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, PERMANENT_REDIRECT);
  }

  if (isLegacyMarketingHost(host)) {
    return redirectToOfficial(request);
  }

  if (isOfficialSiteWwwHost(host)) {
    return redirectToOfficial(request);
  }

  return NextResponse.next();
}

export const config = {
  /** Include static assets so legacy hostnames cannot serve old /images or favicons locally. */
  matcher: ["/((?!_next/static|_next/image).*)"],
};
