<p align="center">
  <img src=".github/brand/readme-light.png#gh-light-mode-only" alt="next-storyblok" width="100%" />
  <img src=".github/brand/readme-dark.png#gh-dark-mode-only" alt="next-storyblok" width="100%" />
</p>

# next-storyblok

Next.js App Router marketing site driven by **Storyblok** blocks. Portfolio proof that editors own copy and structure in a headless CMS while developers own components, draft preview, and cache invalidation.

**Live:** [next-storyblok.marcopontili.com](https://next-storyblok.marcopontili.com)

[![CI](https://github.com/marcop135/next-storyblok/actions/workflows/ci.yml/badge.svg)](https://github.com/marcop135/next-storyblok/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What this proves

| Workflow | How |
| --- | --- |
| Block contract | `page`, `hero`, `feature_grid`, `feature`, `cta_band` mapped in code |
| Draft preview | Next `draftMode` via `/api/preview` |
| Live editing | `@storyblok/react` Visual Editor bridge |
| Publish → refresh | Storyblok webhook → `/api/revalidate` |
| SEO + locales stub | CMS `seo_*` fields + `en`/`de` hreflang routes |

In-app demo brand: **Northline**. Stack signal lives in the repo name and host.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Without a token, mock stories render (`source: mock`). With a Preview token and matching space, the badge reads `source: storyblok`.

Schema: [docs/storyblok-schema.md](docs/storyblok-schema.md). Commands: [docs/commands.md](docs/commands.md). Architecture: [docs/architecture.md](docs/architecture.md).

## Stack

- Next.js 15 App Router (RSC) + React 19
- `@storyblok/react` v5
- Vercel production hosting
- Hand-written CSS + `next/font`

## License

MIT. See [LICENSE](LICENSE).
