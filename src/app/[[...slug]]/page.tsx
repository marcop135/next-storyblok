import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import StoryRenderer from "@/components/StoryRenderer";
import type { PageBlok } from "@/components/types";
import { fetchStory } from "@/lib/fetch-story";
import { hreflangAlternates, storyblokLanguage } from "@/lib/i18n";
import { parseStorySegments } from "@/lib/story-path";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const { locale, slug, pathname } = parseStorySegments(segments);
  const result = await fetchStory(slug, storyblokLanguage(locale));
  if (!result) {
    return { title: "Not found" };
  }

  const content = result.story.content as PageBlok;
  const title =
    content.seo_title || result.story.name || "Northline";
  const description = content.seo_description || undefined;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: pathname ? `/${pathname}` : "/",
      languages: hreflangAlternates(slug),
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug: segments } = await params;
  const { locale, slug } = parseStorySegments(segments);
  const result = await fetchStory(slug, storyblokLanguage(locale));
  if (!result) notFound();

  const { isEnabled: preview } = await draftMode();

  return (
    <>
      <div className="wrap toolbar">
        <span className="source-badge">source: {result.source}</span>
        {preview ? (
          <Link className="source-badge" href="/api/exit-preview">
            exit preview
          </Link>
        ) : null}
        {locale !== "en" ? (
          <span className="source-badge">locale: {locale}</span>
        ) : null}
      </div>
      <StoryRenderer story={result.story} source={result.source} />
    </>
  );
}
