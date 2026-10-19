# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).
- **Links:** Add inline markdown links for related PRs, docs, and external references when they help the reader.

## [Unreleased]

### Added

- Add an editable home hero image with linked photographer credits.

### Changed

- Replace the home block graphic with credited Unsplash website wireframes.
- Clarify the README stack and remove its badges.

## [0.6.0] - 2026-10-19

### Added

- Add image-and-text, accordion, and pull-quote blocks with English and German examples in the block library.
- Introduce the block library on the home page with an editable image-and-text section.

## [0.5.0] - 2026-10-18

### Added

- Add a [For agents](https://nextstory.marcopontili.com/for-agents) page, linked from the footer, sitemap, and `llms.txt`.
- Collapse the header navigation into a menu button on small screens.

### Changed

- Rename the project and the demo site from Northline to Next Story; the repository stays `next-storyblok`.
- Load Fraunces with its optical-size axis so headlines use the display cut.
- Restyle the README, social, and Open Graph images with the demo site fonts and colors.
- Credit the author in the footer and drop the footer GitHub link, which the home page already carries.

## [0.4.2] - 2026-10-18

### Changed

- Simplify the social preview and Open Graph images so they stay readable as small link previews.
- Simplify the README header images.

### Fixed

- Keep German navigation, footer, and page language after client-side navigation from `/de`.

## [0.4.1] - 2026-10-18

### Fixed

- Refresh the sitemap when a story is published, unpublished, deleted, or moved.

## [0.4.0] - 2026-10-18

### Added

- Add [How it works](https://nextstory.marcopontili.com/how-it-works) and [Blocks](https://nextstory.marcopontili.com/blocks) pages.
- Add `steps`, `step`, and `rich_text` blocks, plus a page toggle that labels each section with its block name.
- Serve German copy on `/de` routes from Storyblok field-level translations, with a language switch.
- Edit the header navigation and footer note in a global Storyblok `config` story.
- Keep the content model and seed stories in `storyblok/`, with `npm run storyblok:push` to sync the space.
- Generate block types from the content model and fail CI when they are stale.
- Add a dark theme that follows the system setting.
- Smoke-test every route, link, and the sitemap of the built site in CI.
- Add a security policy, issue forms, and a pull request template.

### Changed

- Upgrade to Next.js 16: the middleware becomes `src/proxy.ts` and linting runs on the ESLint CLI.
- Expire story cache tags immediately on publish, so the next request serves the new content.
- Redesign the README, social preview, and Open Graph images on the shared repo-brand kit.
- Build the sitemap from the Storyblok Links API instead of a fixed path list.
- Render offline pages from the same seed stories the space uses.
- Set `<html lang>` and JSON-LD language per request.
- Allow the Visual Editor bridge script in the Content-Security-Policy.

## [0.3.1] - 2026-10-16

### Fixed

- Report page views and AI-assistant fetches to this site's own Matomo property.

## [0.3.0] - 2026-10-16

### Added

- Add cookieless self-hosted Matomo, a [privacy page](https://nextstory.marcopontili.com/privacy), and security headers with CSP.
- Report AI-assistant page fetches to Matomo from middleware.
- Add sitemap, robots.txt, llms.txt, security.txt, web manifest, icon, and JSON-LD.

### Changed

- Move the canonical host to [nextstory.marcopontili.com](https://nextstory.marcopontili.com).

## [0.2.0] - 2026-10-15

### Added

- Add offline regression tests for server-rendered CMS blocks, draft preview, delivery, and publish webhooks.

### Changed

- Update the Storyblok React SDK to 7.3.1.

### Fixed

- Restore server rendering for CMS-owned pages.
- Isolate published content from the Visual Editor's shared draft cache.
- Verify draft stories before enabling authenticated preview.
- Refresh localized caches across the story lifecycle.
- Reject malformed webhooks without cache changes.
- Keep preview exit redirects on-site.
- Surface CMS outages as errors instead of missing pages.

## [0.1.0] - 2026-10-13

### Added

- Next.js App Router marketing demo wired to Storyblok blocks, draft preview, and publish revalidation.
- Public docs for architecture, commands, and Storyblok component schema.
- CI for lint, changelog checks, and production build.
