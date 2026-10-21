import { draftMode } from "next/headers";
import type { ISbStoryData } from "@storyblok/react";

import { mockStoryForSlug } from "@/lib/mock-story";
import { hasStoryblokToken } from "@/lib/storyblok";
import { storyblokCacheTag, storyCacheTag } from "@/lib/story-cache";
import { normalizeStorySlug } from "@/lib/story-path";

export type StoryResult = {
  story: ISbStoryData;
  source: "storyblok" | "mock";
};

async function resolveVersion(): Promise<"draft" | "published"> {
  const { isEnabled } = await draftMode();
  if (isEnabled) return "draft";
  if (process.env.NODE_ENV === "production") return "published";
  return process.env.STORYBLOK_VERSION === "published" ? "published" : "draft";
}

export function cdnBaseUrl(): string {
  const region = (process.env.STORYBLOK_REGION || "eu").trim();
  // EU host is api.storyblok.com (not api-eu).
  const host =
    region === "eu" ? "api.storyblok.com" : `api-${region}.storyblok.com`;
  return `https://${host}/v2`;
}

export async function fetchStory(
  slug: string,
  language?: string,
  options?: { version: "draft" | "published" },
): Promise<StoryResult | null> {
  const path = normalizeStorySlug(slug);
  if (!path) return null;

  if (!hasStoryblokToken()) {
    const mock = mockStoryForSlug(path, language);
    return mock ? { story: mock, source: "mock" } : null;
  }

  const version = options?.version ?? (await resolveVersion());
  const token = process.env.STORYBLOK_DELIVERY_API_TOKEN!.trim();
  const params = new URLSearchParams({
    version,
    token,
  });
  if (language && language !== "default") {
    params.set("language", language);
  }

  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const url = `${cdnBaseUrl()}/cdn/stories/${encodedPath}?${params}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Draft preview must stay fresh; published can be cached via revalidate route.
      cache: version === "draft" ? "no-store" : "force-cache",
      next: version === "published"
        ? { revalidate: 60, tags: [storyblokCacheTag, storyCacheTag(path)] }
        : undefined,
    });
  } catch {
    // Fetch errors can contain the request URL, including its delivery token.
    throw new Error("Storyblok request failed");
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Storyblok request failed (${res.status})`);

  let data: { story?: ISbStoryData } | null;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid Storyblok response");
  }
  if (!data?.story?.content || typeof data.story.full_slug !== "string") {
    throw new Error("Invalid Storyblok response");
  }
  return { story: data.story, source: "storyblok" };
}
