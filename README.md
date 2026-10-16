<p align="center">
  <img src=".github/brand/readme-light.png#gh-light-mode-only" alt="next-storyblok" width="100%" />
  <img src=".github/brand/readme-dark.png#gh-dark-mode-only" alt="next-storyblok" width="100%" />
</p>

# next-storyblok

Next.js App Router marketing site driven by **Storyblok** blocks. Portfolio proof that editors own copy and structure in a headless CMS while developers own components, draft preview, and cache invalidation.

**Live:** [nextstory.marcopontili.com](https://nextstory.marcopontili.com)

[![CI](https://github.com/marcop135/next-storyblok/actions/workflows/ci.yml/badge.svg)](https://github.com/marcop135/next-storyblok/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What this proves

| Workflow | How |
| --- | --- |
| Block contract | Server-registered `page`, `hero`, `feature_grid`, `feature`, `cta_band` components |
| Draft preview | Authenticated `/api/preview` verifies the story before enabling Next `draftMode` |
| Live editing | Visual Editor bridge in preview; public pages bypass the editor's shared story cache |
| Publish → refresh | Validated publish, unpublish, delete, and move webhooks expire story tags across locales |
| SEO + locales stub | CMS `seo_*` fields + `en`/`de` hreflang routes |

In-app demo brand: **Northline**. Stack signal lives in the repo name and host.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Without a token, mock stories render (`source: mock`). With a Preview token and matching space, the badge reads `source: storyblok`.

Run `npm test` for the rendering, preview, delivery, and webhook regression suite. Production requests use published content, even when `STORYBLOK_VERSION=draft`; authenticated preview uses uncached drafts.

Schema: [docs/storyblok-schema.md](docs/storyblok-schema.md). Commands: [docs/commands.md](docs/commands.md). Architecture: [docs/architecture.md](docs/architecture.md).

## Stack

- Next.js 15 App Router (RSC) + React 19
- `@storyblok/react` v7
- Vercel production hosting
- Cookieless self-hosted Matomo; AI-assistant fetches reported from middleware ([privacy](https://nextstory.marcopontili.com/privacy))
- Hand-written CSS + `next/font`

## License

MIT. See [LICENSE](LICENSE).
