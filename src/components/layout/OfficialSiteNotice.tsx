import Link from "next/link";
import { OFFICIAL_SITE_URL } from "@/lib/site-url";

/** Top banner — directs staff away from the student portal when needed. */
export function OfficialSiteNotice({ surface }: { surface: "portal" | "admin" }) {
  return (
    <div
      className="border-b border-brand-yellow/40 bg-brand-yellow px-4 py-2.5 text-center text-sm font-semibold text-primary"
      role="status"
    >
      {surface === "portal" ? (
        <>
          <span className="font-extrabold">Students only.</span> Registry and staff: use{" "}
          <Link href="/admin" className="underline underline-offset-2 hover:text-accent-green">
            Staff Admin
          </Link>{" "}
          on{" "}
          <a href={OFFICIAL_SITE_URL} className="underline underline-offset-2 hover:text-accent-green">
            mbaleschoolofnursing.ac.ug
          </a>
          .
        </>
      ) : (
        <>
          Staff control panel on{" "}
          <a href={OFFICIAL_SITE_URL} className="underline underline-offset-2 hover:text-accent-green">
            mbaleschoolofnursing.ac.ug
          </a>
          — bookmark{" "}
          <Link href="/admin" className="underline underline-offset-2 hover:text-accent-green">
            Staff Admin
          </Link>
          .
        </>
      )}
    </div>
  );
}
