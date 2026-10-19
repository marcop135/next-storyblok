<p align="center">
  <img src=".github/brand/readme-light.png#gh-light-mode-only" alt="Next Story: editors own the content, developers own the components" width="100%" />
  <img src=".github/brand/readme-dark.png#gh-dark-mode-only" alt="Next Story: editors own the content, developers own the components" width="100%" />
</p>

# Next Story

Next.js App Router marketing site driven by **Storyblok** blocks. Editors own copy, structure, and translations in a headless CMS; developers own the components, draft preview, and cache invalidation.

**Live:** [nextstory.marcopontili.com](https://nextstory.marcopontili.com)

## Click through the demo

| Page | What it shows |
| --- | --- |
| [Home](https://nextstory.marcopontili.com/) | A landing page assembled from `hero`, `image_text`, `feature_grid`, and `cta_band` blocks |
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

- Next.js 16 App Router, React 19 Server Components, and TypeScript
- Storyblok headless CMS with `@storyblok/react` v7
- Vercel production hosting
- Cookieless self-hosted Matomo; AI-assistant fetches reported from the proxy ([privacy](https://nextstory.marcopontili.com/privacy))
- CSS custom properties with system light and dark themes
- Fraunces and Source Sans 3 via `next/font/google`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports and feature requests go through [issues](https://github.com/marcop135/next-storyblok/issues). Vulnerabilities go through [SECURITY.md](./SECURITY.md) instead.

## Author

[Marco Pontili](https://marcopontili.com)

## License

[MIT](./LICENSE)
