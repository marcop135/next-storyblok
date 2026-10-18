# Polish next-storyblok into a portfolio-grade Next.js + Storyblok demo (0.4.0)

## Context

**Why:** The repo is the demo Marco shares with colleagues and employers to prove Next.js App Router and headless-CMS skill. It read as a solid skeleton, not a showcase.

**Evidence:** ImageMagick text-card brand images, unlike the shared repo-brand kit in six sibling repos; two public pages; `/de` serving English; Dependabot PR #5 (Next 16) failing CI on `next lint`; schema in prose only; hard-coded nav and sitemap.

**Outcome:** Kit-based brand images with a block-composed motif; a four-page journey (Home, How it works, Blocks, Pricing) in English and German; content model as code; Next 16; release 0.4.0. Live host stays `nextstory.marcopontili.com` (`nextstory.marketmotiv.com` does not resolve).

## Assumptions tested

| Assumption | Check | Result | Consequence |
| --- | --- | --- | --- |
| A shared brand kit exists | Read `wp-agent-harness/.github/brand/` | Kit 1.0.0: `render.mjs`, `embed-fonts.mjs`, `tokens.json`, fonts, SVG sources | Vendored unchanged; OG output set to `../../public/og.png` (draw pattern) |
| Packages can be installed locally | `npm install` | Denied by command policy | No new dependencies: brand renders through the kit's `npx -p playwright -p sharp` route, smoke test is a plain Node script, types come from a local generator instead of `@storyblok/cli` |
| Storyblok writes need a personal access token | Read `~/.config/mcp-env` | Outside workspace roots | Management API called from the logged-in Storyblok tab; the token never leaves the page. `npm run storyblok:push` covers everyone else with a PAT |
| `de` is enabled in the space | Settings → Internationalization | Only Default | Added `de` through the UI; `GET /v1/spaces/{id}` lists it |
| Translated fields resolve as assumed | Seed with `field__i18n__de`, read back via Management API | Stored as drafts, German values present | Offline mocks resolve the same keys in `src/lib/localize.ts` |
| A separate mock render path is needed | Existing test renders `source: storyblok` with no token | Registry needs no token | Removed the `mock` prop chain; one render path |
| Root layout can localize | `layout.tsx` hard-coded `lang="en"` | Middleware sets `x-site-locale`; layout reads `headers()` | Pages were already dynamic (`draftMode`), so no static route is lost except `/privacy` |
| Pushing published content before deploy is safe | Old code has no `steps`/`rich_text` | New pages would break on the old build | Push as drafts first, publish after the production deploy |
| Next 16 can be verified locally | `npm install` denied | Dependabot branch carries the Next 16 lockfile | Next 16 lands as its own PR on that branch, gated by CI and the Vercel preview |
| Next 16 breaking changes here | context7 Next.js 16 upgrade guide | `next lint` removed, `middleware` → `proxy`, `revalidateTag(tag, profile)` | Covered in the Next 16 PR |

## Changes

1. **Brand** (`.github/brand/`): kit files, SVG sources generated with sibling palette and type, a browser frame built from labelled blocks with the selected `feature_grid` outlined in teal, and an `edit → preview → publish → revalidate` pipeline.
2. **Content model as code** (`storyblok/`): `components.json` for ten blocks with translatable fields, seed stories with German, `scripts/storyblok-push.mjs` + `scripts/lib/storyblok-sync.mjs`, `scripts/storyblok-types.mjs` → `src/types/storyblok.generated.ts`.
3. **App:** `steps`, `step`, `rich_text` blocks; hero secondary link; feature links; `show_block_labels`; `config` story for nav and footer, private as a page and refreshing the layout on publish; language switch; `<html lang>` and JSON-LD per request; sitemap from the Links API; dark theme; CSP for the Visual Editor bridge.
4. **Repo:** README with journey and file map, mermaid architecture, `SECURITY.md`, issue forms, PR template, CI types check and smoke test.
5. **Next 16** (separate PR on `dependabot/npm_and_yarn/next-16.4.0`): `proxy.ts`, ESLint CLI, `revalidateTag(tag, { expire: 0 })`, tests.
6. **Release 0.4.0:** publish the drafts after the production deploy, upload `social.png` (manual), verify live.

## Verification

- `npm run lint`, `npm test`, `npm run changelog:lint`, `npm run build`, `npm run storyblok:types:check`, `npm run smoke` against `next start`: all pass locally and in CI.
- Screenshots of `/`, `/how-it-works`, `/blocks`, `/de`, `/pricing` at 1280 and 390 px, light and dark.
- After publish: live `/de` German, `/how-it-works` and `/blocks` 200, `/config` 404, sitemap lists the journey, `og:image` 1200x630.
