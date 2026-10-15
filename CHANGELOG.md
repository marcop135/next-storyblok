# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).
- **Links:** Add inline markdown links for related PRs, docs, and external references when they help the reader.

## [Unreleased]

### Added

- Add offline regression tests for server-rendered CMS blocks, draft preview, delivery, and publish webhooks.

### Changed

- Update the Storyblok React SDK to 7.3.1 with the existing block and preview APIs.

### Fixed

- Register CMS blocks on the server and isolate public rendering from the Visual Editor's shared draft cache.
- Enforce published content in production and verify draft stories before enabling authenticated preview.
- Invalidate localized content on publish, unpublish, delete, and move events; reject malformed webhooks.
- Keep preview exit redirects on-site and distinguish CMS failures from missing stories.

## [0.1.0] - 2026-10-13

### Added

- Next.js App Router marketing demo wired to Storyblok blocks, draft preview, and publish revalidation.
- Public docs for architecture, commands, and Storyblok component schema.
- CI for lint, changelog checks, and production build.
