const I18N_MARKER = "__i18n__";

/**
 * Resolve Storyblok field-level translations the way the CDN does for
 * `language=<code>`: a non-empty `field__i18n__<code>` replaces `field`, and
 * every translation key is dropped. Used for the offline mock stories.
 */
export function localizeContent<T>(value: T, language?: string): T {
  if (Array.isArray(value)) {
    return value.map((item) => localizeContent(item, language)) as T;
  }
  if (!value || typeof value !== "object") return value;

  const source = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(source)) {
    if (key.includes(I18N_MARKER)) continue;
    const translated = language ? source[`${key}${I18N_MARKER}${language}`] : undefined;
    const chosen = translated !== undefined && translated !== "" ? translated : field;
    out[key] = localizeContent(chosen, language);
  }
  return out as T;
}
