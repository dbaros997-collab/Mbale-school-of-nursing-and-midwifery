import { NextResponse } from "next/server";
import { fetchMicrosoftGraphBundle } from "@/lib/microsoft/graph";

export const maxDuration = 30;

export async function GET() {
  const bundle = await fetchMicrosoftGraphBundle();
  return NextResponse.json(bundle);
}
