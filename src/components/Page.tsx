import {
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import type { SbBlokData } from "@storyblok/react";

import CtaBand from "@/components/CtaBand";
import Feature from "@/components/Feature";
import FeatureGrid from "@/components/FeatureGrid";
import Hero from "@/components/Hero";
import type {
  CtaBandBlok,
  FeatureBlok,
  FeatureGridBlok,
  HeroBlok,
  PageBlok,
} from "@/components/types";

function renderMockBlok(blok: SbBlokData) {
  switch (blok.component) {
    case "hero":
      return <Hero key={blok._uid} blok={blok as HeroBlok} />;
    case "feature_grid":
      return (
        <FeatureGrid key={blok._uid} blok={blok as FeatureGridBlok} mock />
      );
    case "feature":
      return <Feature key={blok._uid} blok={blok as FeatureBlok} />;
    case "cta_band":
      return <CtaBand key={blok._uid} blok={blok as CtaBandBlok} />;
    default:
      return null;
  }
}

type PageProps = {
  blok: PageBlok;
  /** When true, skip StoryblokServerComponent (no API / registry needed). */
  mock?: boolean;
};

export default function Page({ blok, mock = false }: PageProps) {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nested) =>
        mock ? (
          renderMockBlok(nested)
        ) : (
          <StoryblokServerComponent blok={nested} key={nested._uid} />
        ),
      )}
    </main>
  );
}
