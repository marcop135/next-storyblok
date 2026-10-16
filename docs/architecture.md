# Architecture

Northline is a fictional B2B marketing site. The **repo and host** advertise the stack (`next-storyblok`); Storyblok owns page content.

```
Storyblok Visual Editor
        │
        ▼
  draftMode preview ──► Next.js App Router (RSC)
        ▲                      │
        │                      ▼
  /api/preview          Storyblok CDN (draft | published)
        │                      │
  /api/revalidate ◄── publish webhook
        │
        ▼
  revalidateTag(story) + revalidatePath(localized routes)
```

## Request path

1. [`src/app/[[...slug]]/page.tsx`](../src/app/[[...slug]]/page.tsx) parses locale + slug (`/`, `/pricing`, `/de`, `/de/pricing`).
2. [`src/lib/fetch-story.ts`](../src/lib/fetch-story.ts) loads from the CDN when a token is configured; otherwise mock stories keep development offline. Production always requests published content unless draft mode is enabled. Drafts bypass the cache; published fetches share collection and per-story tags across languages, with a 60-second fallback expiry. Missing stories return 404; upstream failures surface as errors, not missing pages.
3. [`src/components/StoryRenderer.tsx`](../src/components/StoryRenderer.tsx) registers blocks on the server. Public stories render through `StoryblokServerComponent`, bypassing the SDK's process-wide editor cache. Authenticated preview uses `StoryblokStory`, which mounts the Visual Editor bridge once. The delivery token stays on the server.
4. [`src/app/api/preview/route.ts`](../src/app/api/preview/route.ts) authenticates, validates the slug and locale, verifies draft content, then enables the cookie. Exit-preview redirects stay on the request origin.
5. [`src/app/api/revalidate/route.ts`](../src/app/api/revalidate/route.ts) accepts publish, unpublish, delete, and move events. Story tags expire all languages; move events also expire the old slug. Legacy ID-only payloads and moves without an old slug expire the collection and root layout. Invalid JSON or story paths return 400 without cache changes; unrelated actions receive a JSON acknowledgement without invalidation.

## Env

| Variable | Role |
| --- | --- |
| `STORYBLOK_DELIVERY_API_TOKEN` | Preview/delivery token (draft + published) |
| `STORYBLOK_REGION` | `eu` for this space |
| `STORYBLOK_VERSION` | Local default (`draft` or `published`); production enforces `published` outside draft mode |
| `STORYBLOK_PREVIEW_SECRET` | Gates `/api/preview` |
| `STORYBLOK_REVALIDATE_SECRET` | Gates `/api/revalidate` |

## Hosting

Production: Vercel + custom domain `https://nextstory.marcopontili.com`. DNS CNAME via Cloudflare. Not a static FTP deploy.

## Analytics and headers

- [`public/matomo.js`](../public/matomo.js) loads self-hosted, cookieless Matomo (site 1) after hydration; [`MatomoRouteTracker`](../src/components/MatomoRouteTracker.tsx) records client navigations.
- [`src/middleware.ts`](../src/middleware.ts) reports AI-assistant fetches (`ChatGPT-User`, `Claude-User`, and the rest of the marcopontili.com access-log needles) to Matomo with `recMode=1` via `waitUntil`. It never changes the response.
- [`next.config.ts`](../next.config.ts) sets CSP, HSTS, `nosniff`, and Referrer-Policy on every route. `frame-ancestors` allows the Storyblok Visual Editor.
