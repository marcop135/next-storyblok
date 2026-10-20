# Storyblok space schema (Next Story)

Open [Storyblok](https://app.storyblok.com/), sign in, select the project space, then open **Content** and a story such as `home`. The Visual Editor edits copy, blocks, and translations; `config` holds navigation and the footer. Save keeps a draft; Publish updates the live content through the configured webhook.

[`storyblok/components.json`](../storyblok/components.json) defines the content model; [`storyblok/stories/`](../storyblok/stories/) contains the seed stories used by the space, generated types, and offline mode.

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
| `hero` | nestable | Headline/links plus image and credit, or `animated_visual` with translated stage labels/caption |
| `feature_grid` / `feature` | nestable | Card grid; a feature with `link_href` becomes a link |
| `steps` / `step` | nestable | Numbered list; `file` links the step to a path in this repository |
| `rich_text` | nestable | Storyblok rich text rendered on the server |
| `image_text` | nestable | Image asset with translated alt text, copy, optional link, and reversible desktop layout |
| `accordion` / `accordion_item` | nestable | Native expandable sections with rich text; keyboard-operable without client JavaScript |
| `pull_quote` | nestable | Quotation with optional attribution |
| `comparison_table` | nestable | Captioned table with column/row headers; native `table` field translates as a whole |
| `code_example` | nestable | Escaped code, language, translated explanation/caption, and repository-relative source link |
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

The space has `de` enabled under Settings → Internationalization. Reader-facing text fields use `translatable`, so German lives in the same story as `field__i18n__de`. Links translate too, so German links point at `/de/...`. Code, language identifiers, and source paths stay unchanged. The comparison table supplies `table__i18n__de` with translated cells. The app requests `language=de` for `/de`; empty translations fall back to English.

Home uses the animated hero and ownership comparison. How-it-works uses an actual source excerpt; the block library shows both new blocks. The type generator supports the table's `thead`/`tbody` shape. Source-parity tests fail if the displayed excerpt no longer matches its linked file.

## Preview and webhook

1. Visual Editor default environment: `https://nextstory.marcopontili.com/` (local: `https://localhost:3000/`). Home real path: `/`.
2. Preview entry: `https://nextstory.marcopontili.com/api/preview?secret=<STORYBLOK_PREVIEW_SECRET>&slug=home&lang=en`. The route verifies the draft before enabling preview; use `lang=de` for German. Previewing `config` opens the home page.
3. Webhook: `POST https://nextstory.marcopontili.com/api/revalidate?secret=<STORYBLOK_REVALIDATE_SECRET>`. Subscribe to story published, unpublished, deleted, and moved events. Include `old_full_slug` on moves to expire both routes. See the [Storyblok webhook payloads](https://www.storyblok.com/docs/concepts/webhooks) and [Next.js cache tags](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).
