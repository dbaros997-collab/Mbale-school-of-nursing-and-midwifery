import { NextResponse } from "next/server";
import { fetchMicrosoftNoticesBundle } from "@/lib/microsoft/graph";

export async function GET() {
  const bundle = await fetchMicrosoftNoticesBundle();
  return NextResponse.json(bundle);
}
