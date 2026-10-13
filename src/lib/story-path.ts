import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export type ParsedStoryPath = {
  locale: Locale;
  /** Storyblok story slug, e.g. `home` or `pricing`. */
  slug: string;
  /** Public pathname without leading slash (`""` for home). */
  pathname: string;
};

/**
 * Parse optional catch-all segments.
 * `/` → home · `/pricing` → pricing · `/de` → home (de) · `/de/pricing` → pricing (de)
 */
export function parseStorySegments(
  segments: string[] | undefined,
): ParsedStoryPath {
  const parts = segments?.filter(Boolean) ?? [];

  if (parts.length === 0) {
    return { locale: defaultLocale, slug: "home", pathname: "" };
  }

  if (isLocale(parts[0])) {
    const locale = parts[0];
    const rest = parts.slice(1);
    if (rest.length === 0) {
      return { locale, slug: "home", pathname: locale };
    }
    const slug = rest.join("/");
    return { locale, slug, pathname: [locale, ...rest].join("/") };
  }

  const slug = parts.join("/");
  return { locale: defaultLocale, slug, pathname: slug };
}

export function publicPathForSlug(slug: string, locale: Locale = defaultLocale): string {
  const base = slug === "home" || slug === "" ? "" : slug;
  if (locale === defaultLocale) {
    return base ? `/${base}` : "/";
  }
  return base ? `/${locale}/${base}` : `/${locale}`;
}
