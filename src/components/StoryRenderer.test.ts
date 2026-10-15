import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

import StoryRenderer from "@/components/StoryRenderer";
import { mockHomeStory } from "@/lib/mock-story";

it("renders CMS blocks on the server without a client provider or delivery token", () => {
  vi.stubEnv("STORYBLOK_DELIVERY_API_TOKEN", "");
  const html = renderToStaticMarkup(createElement(StoryRenderer, {
    story: mockHomeStory,
    source: "storyblok",
  }));
  expect(html).toContain("<h1>Ship every market from one content model</h1>");
  expect(html).toContain("<h3>Block-based pages</h3>");
  expect(html).toContain("Ready when your markets are");
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
