import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

import StoryRenderer from "@/components/StoryRenderer";
import { mockHomeStory, mockPageSlugs, mockStoryForSlug } from "@/lib/mock-story";

function render(slug: string, language?: string) {
  return renderToStaticMarkup(createElement(StoryRenderer, {
    story: mockStoryForSlug(slug, language)!,
    source: "mock",
  }));
}

it("renders CMS blocks on the server without a client provider or delivery token", () => {
  vi.stubEnv("STORYBLOK_DELIVERY_API_TOKEN", "");
  const html = renderToStaticMarkup(createElement(StoryRenderer, {
    story: mockHomeStory,
    source: "storyblok",
  }));
  expect(html).toContain("<h1>Ship every market from one content model</h1>");
  expect(html).toContain("Editors own the page");
  expect(html).toContain("Read the code behind this page");
});

it.each(mockPageSlugs)("renders the %s seed story in both languages", (slug) => {
  const en = render(slug);
  const de = render(slug, "de");
  expect(en).toContain("<h1>");
  expect(de).toContain("<h1>");
  expect(de).not.toBe(en);
  expect(de).not.toContain("__i18n__");
});

it("renders steps, rich text, and block labels from the seed content", () => {
  const html = render("blocks");
  for (const name of ["hero", "feature_grid", "steps", "rich_text", "cta_band"]) {
    expect(html).toContain(`<p class="block-label">${name}</p>`);
  }
  expect(html).toContain('<ol class="steps__list">');
  expect(html).toContain("<code>StoryblokServerRichText</code>");
  expect(html).toContain("<strong>bold</strong>");
});

it("serves German copy and German links from field-level translations", () => {
  const html = render("home", "de");
  expect(html).toContain("Jeden Markt aus einem Content-Modell bedienen");
  expect(html).toContain('href="/de/how-it-works"');
});

it("does not consume another editor's bridge cache when rendering a public story", () => {
  const editorStory = structuredClone(mockHomeStory);
  editorStory.content.body[0].headline = "Unpublished editor headline";
  const cache = (globalThis as typeof globalThis & {
    storyCache: Map<string, typeof mockHomeStory>;
  }).storyCache;
  cache.set(mockHomeStory.uuid, editorStory);
  try {
    const html = renderToStaticMarkup(createElement(StoryRenderer, {
      story: mockHomeStory,
      source: "storyblok",
    }));
    expect(html).toContain("Ship every market from one content model");
    expect(html).not.toContain("Unpublished editor headline");
  } finally {
    cache.delete(mockHomeStory.uuid);
  }
});
