import { apiPlugin, storyblokInit, type StoryblokClient } from "@storyblok/react/rsc";

import CtaBand from "@/components/CtaBand";
import Feature from "@/components/Feature";
import FeatureGrid from "@/components/FeatureGrid";
import Hero from "@/components/Hero";
import Page from "@/components/Page";

export const storyblokComponents = {
  page: Page,
  hero: Hero,
  feature_grid: FeatureGrid,
  feature: Feature,
  cta_band: CtaBand,
};

export function hasStoryblokToken(): boolean {
  return Boolean(process.env.STORYBLOK_DELIVERY_API_TOKEN?.trim());
}

let client: StoryblokClient | null = null;

export function getStoryblokApi(): StoryblokClient {
  if (!client) {
    if (!hasStoryblokToken()) {
      throw new Error(
        "STORYBLOK_DELIVERY_API_TOKEN is missing. Use mock mode or set .env.",
      );
    }
    client = storyblokInit({
      accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
      use: [apiPlugin],
      components: storyblokComponents,
      apiOptions: {
        region: process.env.STORYBLOK_REGION || "eu",
      },
    })();
  }
  return client;
}
