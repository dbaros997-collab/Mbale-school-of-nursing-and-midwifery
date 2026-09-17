import Link from "next/link";
import { getStaffAdminUrl, LEGACY_STUDENT_ADMIN_HOST, OFFICIAL_SITE_URL } from "@/lib/site-url";

/** High-visibility banner so staff know the new admin URL after the SitePad migration. */
export function OfficialSiteNotice({ surface }: { surface: "portal" | "admin" }) {
  return (
    <div
      className="border-b border-brand-yellow/40 bg-brand-yellow px-4 py-2.5 text-center text-sm font-semibold text-primary"
      role="status"
    >
      {surface === "portal" ? (
        <>
          <span className="font-extrabold">Students only.</span> Registry &amp; staff: use{" "}
          <Link href="/admin" className="underline underline-offset-2 hover:text-accent-green">
            Staff Admin
          </Link>{" "}
          on{" "}
          <a href={OFFICIAL_SITE_URL} className="underline underline-offset-2 hover:text-accent-green">
            mbaleschoolofnursing.ac.ug
          </a>
          — not <span className="font-mono text-xs">{LEGACY_STUDENT_ADMIN_HOST}</span> or{" "}
          <span className="font-mono text-xs">mbsnm.org</span>.
        </>
      ) : (
        <>
          New staff control panel (replaces old{" "}
          <a href={getStaffAdminUrl()} className="font-mono text-xs underline underline-offset-2">
            {LEGACY_STUDENT_ADMIN_HOST}
          </a>
          ). Bookmark{" "}
          <a href={getStaffAdminUrl()} className="underline underline-offset-2 hover:text-accent-green">
            {getStaffAdminUrl()}
          </a>
          .
        </>
      )}
    </div>
  );
}
