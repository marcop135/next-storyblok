import { headers } from "next/headers";

import type { ConfigBlok } from "@/components/types";
import { fetchStory } from "@/lib/fetch-story";
import {
  defaultLocale,
  isLocale,
  LOCALE_HEADER,
  storyblokLanguage,
  type Locale,
} from "@/lib/i18n";
import { CONFIG_SLUG } from "@/lib/story-path";

export async function requestLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER);
  return value && isLocale(value) ? value : defaultLocale;
}

/** Navigation and footer copy from the global `config` story; null keeps the shell rendering. */
export async function fetchSiteConfig(locale: Locale): Promise<ConfigBlok | null> {
  try {
    const result = await fetchStory(CONFIG_SLUG, storyblokLanguage(locale));
    return result ? (result.story.content as ConfigBlok) : null;
  } catch {
    return null;
  }
}
