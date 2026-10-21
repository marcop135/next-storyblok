# Animated hero, two CMS blocks, and agent access

## Context

Target: `next-storyblok`, based on `origin/develop` at `1c372c1`. Pages: home, block library, and how-it-works in English/German, plus `/for-agents`. Integrate through three selective PRs: visual/CMS blocks, public reading resources, and documentation/development cycle. Each starts from current `develop` after its predecessor merges. This delivery stops at integration; production promotion and CMS publication follow the separate release contract.

This repository is Marco's public learning project and working demonstration of Next.js, Storyblok, and marketing-site delivery. Its direction is to make a small, complete system understandable, reproducible, and inspectable. Success is demonstrated behavior tied to source, not the number of blocks or agent endpoints.

| Goal | What this increment demonstrates | Public evidence |
| --- | --- | --- |
| Learn | Model and translate structured content; render it on the server; expose it safely in another format; manage a browser API lifecycle | Schema, generated types, focused tests, and short explanations of the choices in existing docs |
| Show capability | Build accessible motion and responsive blocks while preserving draft isolation and cache invalidation | Working EN/DE examples, source links, and rendered verification |
| Share | Let visitors run the demo without credentials and let agents inspect the same public content | Token-free setup, block library, documented Markdown/JSON URLs, and a verified public release |

Keep the existing visitor journey: home shows the result, `/blocks` exposes reusable examples, `/how-it-works` connects behavior to implementation, and `/for-agents` provides machine-readable entry points. `README.md` remains the entry point for people cloning the project. Adapt the useful patterns from `marcopontili.com` to this system's content, with dedicated resource URLs that leave HTML/RSC caching unchanged.

Reference files inspected in `marcopontili.com`: `src/for-agents.php`, `src/assets/js/webmcp.js`, `src/.well-known/api-catalog.php`, `scripts/generate-markdown.js`, `testing/verify-agent-readiness.mjs`, and `docs/site/ref-webmcp.md`.

## Assumptions tested

| Assumption | Check | Result and consequence |
| --- | --- | --- |
| The main image is the homepage hero | `src/components/Hero.tsx`, `storyblok/stories/home.json` | Both media and two-column layout depend on `image.filename`. Animated mode must control both, including when the image field is empty. Preserve image mode elsewhere. |
| Blocks have a single schema and registration path | `storyblok/components.json`, `src/lib/storyblok.ts`, `src/components/types.ts` | Extend the whitelist and server registry; regenerate types instead of hand-editing generated output. |
| English and German share seed content | `src/lib/mock-story.ts`, `src/lib/localize.ts`, home seed | Add field-level translations and localized links to both new blocks and the hero visual. |
| A table field works with the generator | `scripts/storyblok-types.mjs`, [Storyblok fields](https://www.storyblok.com/docs/concepts/fields.html) | Native table fields currently throw. Add typing for the documented `thead`/`tbody`/cell `value` shape. Translate the table itself as well as its heading. |
| Agent discovery and tracking need starting from scratch | `public/llms.txt`, `public/robots.txt`, `src/app/for-agents/page.tsx`, `src/proxy.ts`, `next.config.ts` | Existing SSR, JSON-LD, sitemap, language hints, discovery links, and AI-fetch tracking are reusable foundations. |
| This is a learning demo with a source trail | `README.md`, `docs/architecture.md`, how-it-works seed, `src/components/Step.tsx` | Existing explanations already link behavior to source. Extend those entry points with the new capabilities and their tradeoffs. |
| Seed sync is local-only | `scripts/storyblok-push.mjs`, `scripts/lib/storyblok-sync.mjs` | The CLI writes every seed and publishes by default. The library accepts explicit component/story subsets and `publish: false`; use reviewed subsets for a live write. Local review uses token-free delivery. |
| Dedicated resource routes fit App Router | Installed Next docs, `01-app/03-api-reference/03-file-conventions/route.md`; existing HTML catch-all | Use `src/app/content/[...slug]/route.ts`, await params, and keep HTML routing unchanged. |
| WebMCP registration and cleanup | [Chrome imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api), updated October 16, 2026 | Await `document.modelContext.registerTool` with an `AbortSignal`; abort to remove registrations. Feature-detect native support. |
| Existing verification can be reused | `package.json`, `CONTRIBUTING.md`, `scripts/smoke.mjs`, renderer tests | Extend existing tests/smoke, add Unreleased bullets and `changelog:lint`, then build and inspect rendered output. |

## Changes

### 1. Animated hero

- Add an `animated_visual` boolean to the existing hero schema, enabled only in the home seed. Boolean fields already work with the type generator. Keep the image fields and use the boolean for both layout and media selection.
- Add a server-rendered `PublishingVisual.tsx` using semantic HTML, SVG connectors, and CSS transforms/opacity. Follow the existing Model, Preview, Publish, Serve explanation, ending in EN/DE pages. Present it as an illustration of the architecture, not live CMS status. Reuse existing colors, typography, and hero proportions.
- Run one short sequence, then settle into a readable static state within five seconds. `prefers-reduced-motion` shows that final state immediately. Keep meaningful text readable without animation or JavaScript and hide decorative connectors from assistive technology.
- Preserve the current headline, CTAs, surrounding sections, and other hero instances. Remove the home photo credit only when its photo is not displayed.
- Use home's Hal Gatewood wireframe photo in the block library's image-and-text example, including the same credit and English/German alt text.

### 2. Two new block types

| Block | CMS fields | Rendered example |
| --- | --- | --- |
| `comparison_table` | Translatable heading, introduction, caption, and native table field | Compare changing copy, composing pages, and publishing through an editor versus changing React components through the repo. Use real capabilities rather than performance claims. |
| `code_example` | Translatable heading, explanation, caption; plain-text code, language label, and repository-relative `source_path` | Show a short actual rendering or delivery excerpt, with a source link following `Step.tsx`. Render escaped text in `pre`/`code`. |

- Register exactly these two new component types, with no new child block types. The hero visual is an option on `hero`, not a third block.
- Put the ownership comparison on home before its closing CTA. Put the code example on how-it-works beside the existing implementation explanation. Show both in the labelled block library. Supply English and German fields and check terminology, cell text, captions, and localized links. A fixture check confirms the demonstrated code excerpt still exists in its linked source file.
- Add accessible table headers/caption and a locally scrollable wrapper on narrow screens. Code wraps or scrolls within its section without page overflow. Preserve keyboard focus visibility.
- Extend `scripts/storyblok-types.mjs` for the documented native table payload. Translate table values using the existing field-level seed convention; test German cell content, not only headings. Regenerate `src/types/storyblok.generated.ts` and re-export the new types.

### 3. Public agent resources

| Resource | Purpose and source |
| --- | --- |
| `/content/index.md`, `/content/de/index.md` | Home in Markdown from localized story data. |
| `/content/{slug}.md`, `/content/de/{slug}.md` | Published CMS pages, including nested slugs, serialized from the same blocks as HTML. |
| `/content/for-agents.md` | Portal guidance from the same resource inventory as `/for-agents`. |
| `/content/blocks.json` | Public block descriptions and field summaries derived from the schema's page-block whitelist. |
| `/openapi.json`, `/.well-known/api-catalog` | HTTP descriptions generated from the resource inventory; catalog returns `application/linkset+json`. |
| `/auth.md`, `/.well-known/agent-skills/index.json` | Public-read access rules and concrete reading/inspection workflows linking the implemented resources. |

- Implement a pure block-to-Markdown serializer for existing and new blocks, including rich text, links, image alternatives, tables, and code fences. Skip decorative animation markup. Test code containing backticks, pipes, and newlines.
- Centralize HTML-to-resource URL mapping: `/` maps to `/content/index.md`; `/de` to `/content/de/index.md`; each CMS page maps to its `.md` resource. Reject malformed paths, unsupported locales, and private `config` resources. Return real 404s for missing content and 5xx for upstream failures.
- Extend `fetchStory` to accept explicit `version: "published"` and use it for public Markdown, including development and requests carrying preview cookies. Reuse existing story/collection cache tags so publication and moves invalidate Markdown as well as HTML. Avoid an additional response cache that outlives those tags.
- Parse resource locale explicitly from its path. Return `text/markdown; charset=utf-8`, the canonical HTML link, and content source. Authenticated preview must not change the public representation.
- Use one typed server-side inventory for catalogs, portal rows, skills links, and discovery metadata. Generate block metadata from the schema and test parity with registered page blocks. Serve it through JSON rather than importing the React registry into the client bundle.
- Demonstrate three concrete agent tasks in the existing portal: read a German page without parsing HTML, discover reusable page blocks and translatable fields, and trace a block to its schema/component. Include repo-relative source paths in block metadata, checked against files and registration. The skills index links actual reading workflows, not a claim of autonomous editing support.
- Update `/for-agents` and `llms.txt` with exact resource URLs and copyable requests. Add Markdown alternate links for supported HTML pages. Merge discovery links with existing sitemap/llms headers.

### 4. WebMCP as a small adapter

- Mount one `AgentTools` client boundary. Feature-detect `document.modelContext`, with the deprecated navigator alias only if needed by the tested browser. Register `get_page_markdown` and `list_blocks` with `readOnlyHint: true`.
- Fetch the same Markdown and block JSON resources listed above. Resolve the current pathname at execution time to avoid stale context after client navigation. Return the published page URL and content source; unsupported routes return an explicit unavailable result.
- Keep URL mapping in a browser-safe module. Accept no arbitrary fetch URLs, cap response bytes, and propagate execution cancellation to fetch. Abort registrations on unmount, including partial async registration failures and React development remounts. Unsupported browsers remain inert.
- Verify native behavior when the installed browser exposes it; separately verify lifecycle and calls with a controlled stub. Document actual support without presenting stub results as native verification.
- Add a read-only readiness command against a supplied base URL covering statuses, MIME types, catalog links, Markdown parity, private-path denial, and 404s. Test publication invalidation through controlled CDN fixtures in the existing webhook suite.

### 5. Explain and share the working increment

- Replace affected README capability rows, schema entries, and architecture/command explanations. State what was built, why dedicated resource URLs and a CSS/server-rendered visual were chosen, where their source lives, and the exact verification commands. Keep implementation detail in how-it-works and docs rather than expanding homepage copy.
- Keep setup runnable without a Storyblok account. Document the difference between token-free seeds, connected published delivery, and authenticated editor preview. A visitor must be able to reproduce the new examples from the public checkout.
- After local review, the public-sharing milestone uses the repository's ship contract when shipping is requested: passing gates, feature PR into `develop`, versioned production promotion, Vercel verification, and synchronized integration/production branches. Derive the version and exact release steps from current repo state then.
- Before a live CMS write, read its current schema/stories, capture a local snapshot, and compare against the reviewed baseline. Apply backward-compatible schema extensions and save only reviewed home/blocks/how-it-works changes as drafts. Use `syncSpace` with explicit component/story subsets and `publish: false`; its CLI currently selects every seed. Deploy supporting components before publishing the reviewed stories, check concurrent edits before each write, and verify published EN/DE pages after webhook invalidation. Public completion requires deployed code and published CMS content.

## Files

| Area | Existing files to update | New files or directories |
| --- | --- | --- |
| UI and CMS | `Hero.tsx`, `globals.css`, `components.json`, home/blocks/how-it-works seeds, `storyblok.ts`, component type exports and generated types, type generator, renderer tests | `src/components/PublishingVisual.tsx`, `ComparisonTable.tsx`, `CodeExample.tsx` |
| Resource delivery | `src/lib/fetch-story.ts` for the published override | `src/lib/story-markdown.ts`, shared resource inventory and browser-safe URL mapper, `src/app/content/[...slug]/route.ts`, `src/app/content/blocks.json/route.ts`, focused tests |
| Discovery and tools | `src/app/for-agents/page.tsx`, `public/llms.txt`, `next.config.ts`, `src/app/layout.tsx`, supported pages' alternate links | Public catalog handlers; `src/components/AgentTools.tsx` and registration helper/tests |
| Checks and documentation | `package.json`, `.github/workflows/ci.yml` smoke step, `CHANGELOG.md`, existing architecture/schema/command docs and README capability rows | `scripts/verify-agent-readiness.mjs`, `docs/development-cycle.md` |

Implement and verify four reviewable increments in order: visual/CMS blocks, public resource delivery, discovery/WebMCP, then public explanations and handoff. Complete each increment's tests and explanation before moving on. UI filenames are relative to `src/components/`; schema/seeds are under `storyblok/`. The static `content/blocks.json` route takes precedence over the resource catch-all. List parent directories and read applicable installed Next.js guides before creating routes.

## Verification

1. Confirm the implementation checkout, branch, target pages, and existing paths before edits. Use existing installed dependencies when available; an isolated worktree may need `npm install`. Read relevant installed Next.js guides before code changes.
2. Run `npm run storyblok:types`, `npm run storyblok:types:check`, `npm run lint`, `npm test`, and `npm run changelog:lint`. Cover EN/DE table cells, animation with an empty image field, static image fallback, code/source parity, Markdown escaping/content parity, published-only delivery with preview cookies, webhook invalidation, private paths, 404s, upstream failures, and WebMCP lifecycle.
3. Run `npm run build` and its production server with `STORYBLOK_DELIVERY_API_TOKEN` empty in each process environment. Keep environment files unchanged and inspect `git status` for unintended artifacts. Run `npm run smoke -- <base-url>` and the new readiness command. Assert block placement, absence of the home photo, correct MIME/status codes, valid catalogs/source links, and unchanged HTML/RSC navigation. Add readiness to the existing CI smoke step so public resource drift fails CI. Use controlled CDN fixtures for published/draft and invalidation tests.
4. Before starting each local server, check port availability and reservations: macOS `lsof -iTCP:<port> -sTCP:LISTEN`; Windows `Get-NetTCPConnection` and `netsh int ipv4 show excludedportrange protocol=tcp`; WSL `ss -ltn`. Start only on a free, unreserved port and retain its exact PID.
5. Stop only the production-check process started for this task, then run `npm run dev -- --hostname 127.0.0.1 --port <port>`. Use process-local token-free seed delivery for the requested local review, without editing secrets or publishing to Storyblok.
6. Verify the actual dev instance with Playwright directly at desktop, tablet, and mobile widths in light/dark themes. Inspect the hero sequence, reduced-motion final state, new blocks, German routes, keyboard access, overflow, and current-page tool context after client navigation. Check native WebMCP when available and stubbed registration separately. Save screenshots and a short hero-animation recording.
7. Reproduce the documented token-free startup and the portal's three agent tasks against that dev instance. Open home in the default browser, leave its reviewed process running, and deliver the exact URL, screenshots, and recording. This is the local-review milestone; the public-sharing milestone is verified against the deployed, CMS-connected site through the requested ship flow.

