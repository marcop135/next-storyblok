import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { publicPathForSlug } from "@/lib/story-path";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const slug = request.nextUrl.searchParams.get("slug") || "home";
  const langParam = request.nextUrl.searchParams.get("lang") || defaultLocale;
  const locale: Locale = isLocale(langParam) ? langParam : defaultLocale;

  const expected = process.env.STORYBLOK_PREVIEW_SECRET?.trim();
  if (!expected || secret !== expected) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(publicPathForSlug(slug, locale));
}
