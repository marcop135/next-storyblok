import type { NextFetchEvent, NextRequest } from "next/server";

import {
  matomoTrackingUrl,
  shouldSkipPath,
  uaIsAiAssistant,
} from "@/lib/ai-assistant";

/**
 * Report AI-assistant fetches to Matomo. Runs before the Vercel cache, so
 * cached pages count too. Never blocks or alters the response.
 */
export function middleware(request: NextRequest, event: NextFetchEvent) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!uaIsAiAssistant(ua) || shouldSkipPath(request.nextUrl.pathname)) return;

  event.waitUntil(
    fetch(matomoTrackingUrl(request.url, ua), { method: "GET" }).catch(
      () => {},
    ),
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|eot|otf)$).*)",
  ],
};
