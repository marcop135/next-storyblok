import { storyblokEditable } from "@storyblok/react/rsc";

import type { HeroBlok } from "@/components/types";

export default function Hero({ blok }: { blok: HeroBlok }) {
  return (
    <section className="hero" {...storyblokEditable(blok)}>
      <div className="wrap">
        {blok.eyebrow ? <p className="eyebrow">{blok.eyebrow}</p> : null}
        <h1>{blok.headline}</h1>
        {blok.subheadline ? <p className="lead">{blok.subheadline}</p> : null}
        {blok.cta_label && blok.cta_href ? (
          <p>
            <a className="btn" href={blok.cta_href}>
              {blok.cta_label}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
