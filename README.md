<p align="center">
  <img src=".github/brand/readme-light.png#gh-light-mode-only" alt="next-storyblok: editors own the content, developers own the components" width="100%" />
  <img src=".github/brand/readme-dark.png#gh-dark-mode-only" alt="next-storyblok: editors own the content, developers own the components" width="100%" />
</p>

# next-storyblok

Next.js App Router marketing site driven by **Storyblok** blocks. Editors own copy, structure, and translations in a headless CMS; developers own the components, draft preview, and cache invalidation. In-app demo brand: **Northline**.

**Live:** [nextstory.marcopontili.com](https://nextstory.marcopontili.com)

[![CI](https://github.com/marcop135/next-storyblok/actions/workflows/ci.yml/badge.svg)](https://github.com/marcop135/next-storyblok/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Click through the demo

| Page | What it shows |
| --- | --- |
| [Home](https://nextstory.marcopontili.com/) | A landing page assembled from `hero`, `feature_grid`, and `cta_band` blocks |
| [How it works](https://nextstory.marcopontili.com/how-it-works) | The path from a Storyblok edit to the live page, each step linked to its file |
| [Blocks](https://nextstory.marcopontili.com/blocks) | Every block once, labelled with its component name by a CMS toggle |
| [Deutsch](https://nextstory.marcopontili.com/de) | The same stories through field-level translations, with a language switch |

## Where to look

| Claim | File |
| --- | --- |
| Content model as code, pushed to the space | [`storyblok/components.json`](storyblok/components.json), [`scripts/storyblok-push.mjs`](scripts/storyblok-push.mjs) |
| Types generated from that model, checked in CI | [`scripts/storyblok-types.mjs`](scripts/storyblok-types.mjs) → [`src/types/storyblok.generated.ts`](src/types/storyblok.generated.ts) |
| Blocks map 1:1 to React Server Components | [`src/lib/storyblok.ts`](src/lib/storyblok.ts), [`src/components/`](src/components/) |
| Draft preview checks the secret and the draft first | [`src/app/api/preview/route.ts`](src/app/api/preview/route.ts) |
| Publish, unpublish, delete, and move webhooks expire story tags in every language | [`src/app/api/revalidate/route.ts`](src/app/api/revalidate/route.ts) |
| Navigation and footer edited in a global `config` story | [`src/lib/site-config.ts`](src/lib/site-config.ts), [`src/app/layout.tsx`](src/app/layout.tsx) |
| German routes, `hreflang`, and `<html lang>` per request | [`src/lib/i18n.ts`](src/lib/i18n.ts), [`src/proxy.ts`](src/proxy.ts) |
| Sitemap built from the Storyblok Links API | [`src/lib/published-slugs.ts`](src/lib/published-slugs.ts) |
| Offline development from the same seed stories | [`src/lib/mock-story.ts`](src/lib/mock-story.ts), [`src/lib/localize.ts`](src/lib/localize.ts) |

Request path and diagram: [docs/architecture.md](docs/architecture.md). Schema and languages: [docs/storyblok-schema.md](docs/storyblok-schema.md). Commands: [docs/commands.md](docs/commands.md).

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Without a token, the seed stories in `storyblok/stories/` render (`source: mock`) in both languages. With a preview token and matching space, the badge reads `source: storyblok`.

`npm test` covers rendering, translations, preview, delivery, sitemap, and webhooks; `npm run smoke` checks every route of a running build. Production requests use published content, even when `STORYBLOK_VERSION=draft`; authenticated preview uses uncached drafts.

## Stack

- Next.js 16 App Router (RSC) + React 19
- `@storyblok/react` v7
- Vercel production hosting
- Cookieless self-hosted Matomo; AI-assistant fetches reported from the proxy ([privacy](https://nextstory.marcopontili.com/privacy))
- Hand-written CSS with light and dark themes + `next/font`

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).
