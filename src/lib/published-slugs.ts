import { cdnBaseUrl } from "@/lib/fetch-story";
import { mockPageSlugs } from "@/lib/mock-story";
import { hasStoryblokToken } from "@/lib/storyblok";
import { storyblokCacheTag } from "@/lib/story-cache";
import { isPageSlug, normalizeStorySlug } from "@/lib/story-path";

type StoryblokLink = { slug: string; is_folder: boolean; published: boolean };

/** Published page slugs from the Storyblok Links API; the seed stories offline or on failure. */
export async function publishedPageSlugs(): Promise<string[]> {
  if (!hasStoryblokToken()) return mockPageSlugs;
  const params = new URLSearchParams({
    version: "published",
    token: process.env.STORYBLOK_DELIVERY_API_TOKEN!.trim(),
    per_page: "1000",
  });
  try {
    const res = await fetch(`${cdnBaseUrl()}/cdn/links?${params}`, {
      next: { revalidate: 3600, tags: [storyblokCacheTag] },
    });
    if (!res.ok) return mockPageSlugs;
    const data = (await res.json()) as { links?: Record<string, StoryblokLink> };
    const slugs = Object.values(data.links ?? {})
      .filter((link) => !link.is_folder && link.published)
      .map((link) => normalizeStorySlug(link.slug))
      .filter((slug): slug is string => slug !== null && isPageSlug(slug));
    return slugs.length ? slugs : mockPageSlugs;
  } catch {
    // Fetch errors can contain the request URL, including its delivery token.
    return mockPageSlugs;
  }
}
