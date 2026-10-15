import { setComponents } from "@storyblok/react/rsc";

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

export function registerStoryblokComponents(): void {
  setComponents(storyblokComponents);
}
