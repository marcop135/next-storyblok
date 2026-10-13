import { storyblokEditable } from "@storyblok/react/rsc";

import type { CtaBandBlok } from "@/components/types";

export default function CtaBand({ blok }: { blok: CtaBandBlok }) {
  return (
    <section className="cta-band" {...storyblokEditable(blok)}>
      <div className="wrap">
        <h2>{blok.headline}</h2>
        {blok.text ? <p>{blok.text}</p> : null}
        {blok.cta_label && blok.cta_href ? (
          <p>
            <a className="btn btn--ghost" href={blok.cta_href}>
              {blok.cta_label}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
