import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const next = request.nextUrl.searchParams.get("next") || "/";
  let target: URL;
  try {
    target = new URL(next, request.nextUrl.origin);
  } catch {
    redirect("/");
  }
  const local = next.startsWith("/") && !/[\\\u0000-\u001f\u007f]/u.test(next)
    && target.origin === request.nextUrl.origin;
  redirect(local ? `${target.pathname}${target.search}${target.hash}` : "/");
}
