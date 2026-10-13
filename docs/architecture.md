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
  revalidatePath(/, /pricing, /de/…)
```

## Request path

1. [`src/app/[[...slug]]/page.tsx`](../src/app/[[...slug]]/page.tsx) parses locale + slug (`/`, `/pricing`, `/de`, `/de/pricing`).
2. [`src/lib/fetch-story.ts`](../src/lib/fetch-story.ts) loads from the CDN when `STORYBLOK_DELIVERY_API_TOKEN` is set; otherwise mock stories keep `npm run dev` offline.
3. [`src/components/StoryRenderer.tsx`](../src/components/StoryRenderer.tsx) renders via `@storyblok/react/rsc` (`StoryblokStory` + `StoryblokLiveEditing`) or the mock `Page` path.
4. Blok React map lives in [`src/lib/storyblok.ts`](../src/lib/storyblok.ts): `page`, `hero`, `feature_grid`, `feature`, `cta_band`.

## Env

| Variable | Role |
| --- | --- |
| `STORYBLOK_DELIVERY_API_TOKEN` | Preview/delivery token (draft + published) |
| `STORYBLOK_REGION` | `eu` for this space |
| `STORYBLOK_VERSION` | `draft` locally; `published` in production |
| `STORYBLOK_PREVIEW_SECRET` | Gates `/api/preview` |
| `STORYBLOK_REVALIDATE_SECRET` | Gates `/api/revalidate` |

## Hosting

Production: Vercel + custom domain `https://next-storyblok.marcopontili.com`. DNS CNAME via Cloudflare. Not a static FTP deploy.
