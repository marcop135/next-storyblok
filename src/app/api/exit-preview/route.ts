import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const next = request.nextUrl.searchParams.get("next") || "/";
  redirect(next.startsWith("/") ? next : "/");
}
