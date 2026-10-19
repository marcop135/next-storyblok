import Image from "next/image";
import Link from "next/link";
import { storyblokEditable } from "@storyblok/react/rsc";

import type { HeroBlok } from "@/components/types";

export default function Hero({ blok }: { blok: HeroBlok }) {
  const primary = blok.cta_label && blok.cta_href;
  const secondary = blok.secondary_label && blok.secondary_href;
  const imageSrc = blok.image?.filename;
  return (
    <section className="hero" {...storyblokEditable(blok)}>
      <div className={`wrap${imageSrc ? " hero__layout" : ""}`}>
        <div>
          {blok.eyebrow ? <p className="eyebrow">{blok.eyebrow}</p> : null}
          <h1>{blok.headline}</h1>
          {blok.subheadline ? <p className="lead">{blok.subheadline}</p> : null}
          {primary || secondary ? (
            <p className="actions">
              {primary ? (
                <Link className="btn" href={blok.cta_href!}>
                  {blok.cta_label}
                </Link>
              ) : null}
              {secondary ? (
                <Link className="btn btn--secondary" href={blok.secondary_href!}>
                  {blok.secondary_label}
                </Link>
              ) : null}
            </p>
          ) : null}
        </div>
        {imageSrc ? (
          <figure className="hero__figure">
            <div className="hero__media">
              <Image
                src={imageSrc}
                alt={blok.image_alt ?? blok.image?.alt ?? ""}
                fill
                sizes="(min-width: 68rem) 520px, (min-width: 48rem) 50vw, 100vw"
                preload
              />
            </div>
            {blok.image?.copyright && blok.image.source ? (
              <figcaption className="image-credit">
                <a href={blok.image.source}>{blok.image.copyright}</a>
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>
    </section>
  );
}
