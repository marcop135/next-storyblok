/**
 * AI-assistant fetch detection for Matomo, mirroring UA_NEEDLES and
 * should_skip_path() in the marcopontili.com access-log cron
 * (scripts/matomo-ai-chatbot-from-access-log.php).
 */
export const UA_NEEDLES = [
  "ChatGPT-User",
  "Claude-User",
  "Perplexity-User",
  "MistralAI-User",
  "Gemini-Deep-Research",
  "Google-NotebookLM",
] as const;

export const MATOMO_TRACKER_URL = "https://mt.marcopontili.com/m/matomo.php";
export const MATOMO_SITE_ID = "1";
export const TRACKING_SOURCE = "vercel-middleware";

/** Case-insensitive substring match, like PHP stripos(). */
export function uaIsAiAssistant(ua: string | null | undefined): boolean {
  if (!ua) return false;
  const haystack = ua.toLowerCase();
  return UA_NEEDLES.some((needle) => haystack.includes(needle.toLowerCase()));
}

const STATIC_ASSET =
  /\.(?:css|js|mjs|map|woff2?|ttf|eot|png|jpe?g|gif|webp|avif|svg|ico)$/i;

/** Keep pages, llms.txt, robots.txt and .well-known; skip static binaries. */
export function shouldSkipPath(path: string): boolean {
  const pathOnly = path.split("?")[0] || path;
  if (pathOnly.startsWith("/_next/")) return true;
  return STATIC_ASSET.test(pathOnly);
}

export function matomoTrackingUrl(url: string, ua: string): string {
  const params = new URLSearchParams({
    idsite: MATOMO_SITE_ID,
    rec: "1",
    recMode: "1",
    url,
    ua,
    source: TRACKING_SOURCE,
  });
  return `${MATOMO_TRACKER_URL}?${params}`;
}
