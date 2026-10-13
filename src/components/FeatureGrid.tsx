import {
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";

import Feature from "@/components/Feature";
import type { FeatureGridBlok } from "@/components/types";

type Props = {
  blok: FeatureGridBlok;
  mock?: boolean;
};

export default function FeatureGrid({ blok, mock = false }: Props) {
  return (
    <section
      id="features"
      className="feature-grid"
      {...storyblokEditable(blok)}
    >
      <div className="wrap">
        {blok.headline ? <h2>{blok.headline}</h2> : null}
        <div className="feature-grid__list">
          {blok.features?.map((feature) =>
            mock ? (
              <Feature key={feature._uid} blok={feature} />
            ) : (
              <StoryblokServerComponent blok={feature} key={feature._uid} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
