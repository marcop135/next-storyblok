import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import {
  matomoTrackingUrl,
  shouldSkipPath,
  uaIsAiAssistant,
} from "@/lib/ai-assistant";
import { LOCALE_HEADER, localeForPathname } from "@/lib/i18n";

/**
 * Pass the path locale to the root layout, and report AI-assistant fetches to
 * Matomo. Runs before the Vercel cache, so cached pages count too. Never
 * blocks or alters the response.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const ua = request.headers.get("user-agent") ?? "";
  if (uaIsAiAssistant(ua) && !shouldSkipPath(request.nextUrl.pathname)) {
    event.waitUntil(
      fetch(matomoTrackingUrl(request.url, ua), { method: "GET" }).catch(
        () => {},
      ),
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, localeForPathname(request.nextUrl.pathname));
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\.ico|.*\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|eot|otf)$).*)",
  ],
};
