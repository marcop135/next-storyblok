# Storyblok space schema (Northline)

Recreate this in a free Storyblok Starter space (EU recommended). Match technical names exactly.

## Components

### `page` (nestable: no)

| Field | Type |
| --- | --- |
| `seo_title` | Text |
| `seo_description` | Textarea |
| `body` | Blocks (`hero`, `feature_grid`, `cta_band`) |

### `hero`

| Field | Type |
| --- | --- |
| `eyebrow` | Text |
| `headline` | Text |
| `subheadline` | Textarea |
| `cta_label` | Text |
| `cta_href` | Text |

### `feature_grid`

| Field | Type |
| --- | --- |
| `headline` | Text |
| `features` | Blocks (`feature`) |

### `feature`

| Field | Type |
| --- | --- |
| `title` | Text |
| `text` | Textarea |

### `cta_band`

| Field | Type |
| --- | --- |
| `headline` | Text |
| `text` | Textarea |
| `cta_label` | Text |
| `cta_href` | Text |

## Stories

| Name | Slug | Root |
| --- | --- | --- |
| Home | `home` | `page` |
| Pricing | `pricing` | `page` |

Seed body content from the mock stories in `src/lib/mock-story.ts`.

## Preview & webhook

1. Visual Editor default environment: `https://next-storyblok.marcopontili.com/` (local: `https://localhost:3000/`). Home real path: `/`.
2. Preview entry: `https://next-storyblok.marcopontili.com/api/preview?secret=<STORYBLOK_PREVIEW_SECRET>&slug=home&lang=en`. The route verifies the draft before enabling preview; use `lang=de` for German.
3. Webhook: `POST https://next-storyblok.marcopontili.com/api/revalidate?secret=<STORYBLOK_REVALIDATE_SECRET>`. Subscribe to story published, unpublished, deleted, and moved events. Include `old_full_slug` on moves to expire both routes. See the [Storyblok webhook payloads](https://www.storyblok.com/docs/concepts/webhooks) and [Next.js 15 cache tags](https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag).

## Languages (stub)

Enable `de` in space languages when ready. Routes: `/` (en), `/de`, `/pricing`, `/de/pricing`. The app sends Storyblok `language=de` for the `de` prefix.
