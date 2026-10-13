import { draftMode } from "next/headers";
import type { ISbStoryData } from "@storyblok/react";

import { mockStoryForSlug } from "@/lib/mock-story";
import { hasStoryblokToken } from "@/lib/storyblok";

export type StoryResult = {
  story: ISbStoryData;
  source: "storyblok" | "mock";
};

function storyPath(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, "") || "home";
}

async function resolveVersion(): Promise<"draft" | "published"> {
  const { isEnabled } = await draftMode();
  if (isEnabled) return "draft";
  return process.env.STORYBLOK_VERSION === "published" ? "published" : "draft";
}

function cdnBaseUrl(): string {
  const region = (process.env.STORYBLOK_REGION || "eu").trim();
  // EU host is api.storyblok.com (not api-eu).
  const host =
    region === "eu" ? "api.storyblok.com" : `api-${region}.storyblok.com`;
  return `https://${host}/v2`;
}

export async function fetchStory(
  slug: string,
  language?: string,
): Promise<StoryResult | null> {
  const path = storyPath(slug);

  if (!hasStoryblokToken()) {
    const mock = mockStoryForSlug(path);
    return mock ? { story: mock, source: "mock" } : null;
  }

  const version = await resolveVersion();
  const token = process.env.STORYBLOK_DELIVERY_API_TOKEN!.trim();
  const params = new URLSearchParams({
    version,
    token,
  });
  if (language && language !== "default") {
    params.set("language", language);
  }

  const url = `${cdnBaseUrl()}/cdn/stories/${encodeURI(path)}?${params}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Draft preview must stay fresh; published can be cached via revalidate route.
      cache: version === "draft" ? "no-store" : "force-cache",
      next: version === "published" ? { revalidate: 60 } : undefined,
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(
        `[fetchStory] CDN ${res.status} for "${path}": ${body.slice(0, 200)}`,
      );
      return null;
    }

    const data = (await res.json()) as { story: ISbStoryData };
    return { story: data.story, source: "storyblok" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[fetchStory] CDN miss for "${path}": ${message}`);
    return null;
  }
}
