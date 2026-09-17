import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getStaffAdminUrl,
  isLegacyStudentAdminHost,
  OFFICIAL_SITE_URL,
} from "@/lib/site-url";

/** Legacy WordPress host — send visitors to the new official site once DNS points here. */
const LEGACY_HOSTS = new Set(["mbsnm.org", "www.mbsnm.org"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (!host) {
    return NextResponse.next();
  }

  if (isLegacyStudentAdminHost(host)) {
    const target = new URL(getStaffAdminUrl());
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 308);
  }

  if (!LEGACY_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, OFFICIAL_SITE_URL);
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api).*)"],
};
