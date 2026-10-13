/** Stub locales for hreflang / Storyblok language param demos. */
export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Map site locale → Storyblok `language` query (default space language omitted). */
export function storyblokLanguage(locale: Locale): string | undefined {
  if (locale === defaultLocale) return undefined;
  return locale;
}

export function hreflangAlternates(path: string): Record<string, string> {
  const normalized = path === "home" || path === "" ? "" : `/${path}`;
  return {
    en: normalized || "/",
    de: normalized ? `/de${normalized}` : "/de",
    "x-default": normalized || "/",
  };
}
