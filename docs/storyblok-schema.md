# Storyblok space schema (Northline)

[`storyblok/components.json`](../storyblok/components.json) is the content model and [`storyblok/stories/`](../storyblok/stories/) holds the seed stories. The same files feed the space, the generated TypeScript types, and the offline mock stories.

```bash
npm run storyblok:push -- --dry-run   # list the changes
npm run storyblok:push                # create or replace components by name, stories by slug, then publish
npm run storyblok:push -- --draft     # save drafts without publishing
npm run storyblok:types               # regenerate src/types/storyblok.generated.ts
```

`storyblok:push` needs `STORYBLOK_PERSONAL_ACCESS_TOKEN` and `STORYBLOK_SPACE_ID` in `.env`. It writes to the live space.

## Blocks

| Component | Kind | Renders as |
| --- | --- | --- |
| `page` | content type | Page body; `show_block_labels` labels each section with its component name |
| `hero` | nestable | Headline, lead, links, optional image with translated alt text, and linked photographer credit |
| `feature_grid` / `feature` | nestable | Card grid; a feature with `link_href` becomes a link |
| `steps` / `step` | nestable | Numbered list; `file` links the step to a path in this repository |
| `rich_text` | nestable | Storyblok rich text rendered on the server |
| `image_text` | nestable | Image asset with translated alt text, copy, optional link, and reversible desktop layout |
| `accordion` / `accordion_item` | nestable | Native expandable sections with rich text; keyboard-operable without client JavaScript |
| `pull_quote` | nestable | Quotation with optional attribution |
| `cta_band` | nestable | Full-width call to action |
| `config` / `nav_link` | content type | Global story `config`: header navigation and footer note; never served as a page |

## Stories

| Slug | Content type |
| --- | --- |
| `home` | `page` |
| `how-it-works` | `page` |
| `blocks` | `page` |
| `pricing` | `page` |
| `config` | `config` |

## Languages

The space has `de` enabled under Settings → Internationalization. Every text field is `translatable`, so German lives in the same story as `field__i18n__de`. Link fields are translatable too, so German links point at `/de/...` routes. The app sends `language=de` for the `/de` prefix; an empty translation falls back to English.

## Preview and webhook

1. Visual Editor default environment: `https://nextstory.marcopontili.com/` (local: `https://localhost:3000/`). Home real path: `/`.
2. Preview entry: `https://nextstory.marcopontili.com/api/preview?secret=<STORYBLOK_PREVIEW_SECRET>&slug=home&lang=en`. The route verifies the draft before enabling preview; use `lang=de` for German. Previewing `config` opens the home page.
3. Webhook: `POST https://nextstory.marcopontili.com/api/revalidate?secret=<STORYBLOK_REVALIDATE_SECRET>`. Subscribe to story published, unpublished, deleted, and moved events. Include `old_full_slug` on moves to expire both routes. See the [Storyblok webhook payloads](https://www.storyblok.com/docs/concepts/webhooks) and [Next.js cache tags](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).
