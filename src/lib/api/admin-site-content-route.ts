import { requireStaffAuth } from "@/lib/admin/require-staff-auth";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function withAdminSiteContentAccess(
  handler: () => Promise<Response>,
): Promise<Response> {
  const auth = await requireStaffAuth();
  if (!auth.authorized) return auth.response;

  try {
    return await handler();
  } catch (error) {
    console.error("[admin-site-content]", error);
    return Response.json(
      {
        ok: false,
        code: "SITE_CONTENT_ERROR",
        message: error instanceof Error ? error.message : "Could not update site content.",
      },
      { status: 500, headers: NO_STORE },
    );
  }
}
