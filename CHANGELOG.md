# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).
- **Links:** Add inline markdown links for related PRs, docs, and external references when they help the reader.

## [Unreleased]

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
