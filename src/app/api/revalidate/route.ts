import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { publicPathForSlug } from "@/lib/story-path";
import { defaultLocale, locales } from "@/lib/i18n";

type StoryblokWebhookBody = {
  full_slug?: string;
  slug?: string;
  action?: string;
};

function pathsForStory(fullSlug: string): string[] {
  const slug = fullSlug.replace(/^\/+|\/+$/g, "") || "home";
  const paths = new Set<string>();
  for (const locale of locales) {
    paths.add(publicPathForSlug(slug, locale));
  }
  if (slug === "home") {
    paths.add("/");
  }
  return [...paths];
}

export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-revalidate-secret");
  const expected = process.env.STORYBLOK_REVALIDATE_SECRET?.trim();

  if (!expected || secret !== expected) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: StoryblokWebhookBody = {};
  try {
    body = (await request.json()) as StoryblokWebhookBody;
  } catch {
    body = {};
  }

  const fullSlug = body.full_slug || body.slug || "home";
  const paths = pathsForStory(fullSlug);

  for (const path of paths) {
    revalidatePath(path);
  }

  // Always refresh default home when a story changes and slug is ambiguous
  if (!body.full_slug && !body.slug) {
    revalidatePath(publicPathForSlug("home", defaultLocale));
  }

  return Response.json({ ok: true, revalidated: paths });
}
