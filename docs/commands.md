# Commands

```bash
npm install
cp .env.example .env   # then fill Storyblok tokens
npm run dev            # http://localhost:3000
npm run lint
npm test                # offline CMS delivery, server rendering, preview, and webhook checks
npm run changelog:lint
npm run build
npm start              # after build
npm run smoke          # route, language, link, and sitemap checks against a running build
npm run verify:agent-readiness  # public Markdown/JSON, catalogs, parity, access, and 404s
```

## Storyblok

Push the content model and seed stories, and regenerate types, as described in [storyblok-schema.md](storyblok-schema.md):

```bash
npm run storyblok:push -- --dry-run
npm run storyblok:push
npm run storyblok:types        # after editing storyblok/components.json
npm run storyblok:types:check  # CI: fails when the generated types are stale
```

Preview (draftMode):

```text
/api/preview?secret=<STORYBLOK_PREVIEW_SECRET>&slug=home&lang=en
```

Preview verifies draft content before setting a cookie. Nested slugs are supported; invalid paths return 400, missing stories 404, and unavailable content 503. Production stays on published content outside an authenticated preview session.

Exit preview: `/api/exit-preview?next=/pricing`. Return paths must stay on the same origin.

Publish webhook:

```text
POST /api/revalidate?secret=<STORYBLOK_REVALIDATE_SECRET>
```

The `x-revalidate-secret` header is also accepted. Subscribe to `published`, `unpublished`, `deleted`, and `moved` story events. Payloads use `full_slug` (or legacy `slug`); moves include `old_full_slug`. A positive numeric `story_id` without a slug expires all stories. A malformed payload returns 400 and does not change the cache.

Example body: `{"action":"published","story_id":123,"full_slug":"pricing"}`. A successful response lists the affected public paths; tagged content refreshes on the next request across languages.

## Brand images

```bash
npm run brand:render    # requires the brand kit's Playwright/sharp tooling
npm run brand:check
```

Sources and tooling: [.github/brand/README.md](../.github/brand/README.md). Local commits, changelog/version ownership, annotated tags, promotion, and CMS publication: [development cycle](development-cycle.md).
