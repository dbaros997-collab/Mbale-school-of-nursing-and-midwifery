import { NextResponse } from "next/server";
import { streamDriveItemContent } from "@/lib/microsoft/graph";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { itemId } = await context.params;
  const result = await streamDriveItemContent(itemId);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return new NextResponse(result.body, {
    headers: {
      "Content-Type": result.contentType,
      "Content-Disposition": `inline; filename="${result.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
