import type { SbBlokData } from "@storyblok/react";

export type HeroBlok = SbBlokData & {
  component: "hero";
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  cta_label?: string;
  cta_href?: string;
};

export type FeatureBlok = SbBlokData & {
  component: "feature";
  title: string;
  text?: string;
};

export type FeatureGridBlok = SbBlokData & {
  component: "feature_grid";
  headline?: string;
  features?: FeatureBlok[];
};

export type CtaBandBlok = SbBlokData & {
  component: "cta_band";
  headline: string;
  text?: string;
  cta_label?: string;
  cta_href?: string;
};

export type PageBlok = SbBlokData & {
  component: "page";
  seo_title?: string;
  seo_description?: string;
  body?: SbBlokData[];
};
