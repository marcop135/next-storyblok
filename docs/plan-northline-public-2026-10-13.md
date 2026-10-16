# Ship Northline as a public headless demo

## Context

**Why:** Close the Phrase-class portfolio gap: a marketing site whose pages are CMS-owned (Next.js App Router + Storyblok), not WP themes or Tailwind static fronts. Audience: employers, hiring developers, and clients evaluating headless CMS workflow skill.

**Evidence:** Space Northline is live; localhost serves `source: storyblok` for `/` and `/pricing`. Phases 1–3 code (catch-all, draftMode preview, revalidate webhook, SEO/hreflang stub) exist. No git commits, no remote, `package.json` still `"private": true`.

**Intended outcome:** Public GitHub repo + live custom domain on `*.marcopontili.com` that proves editor → Visual Editor / preview → publish → revalidate, with tight changelog, CI, and brand assets matching sibling public repos.

**Hostname (open; Northline-as-host rejected):** In-app brand stays **Northline**. The public host should carry **stack signal** for CV/LinkedIn scanners. Sibling product hosts (`md2pdf`, `draw`, `bullframecss`) are fine when the product *is* the portfolio object; here the object is the **workflow**, so a stack slug reads clearer than a fictional SaaS name.

| Candidate | Pros | Cons |
| --- | --- | --- |
| `nextstory.marcopontili.com` | Matches original intent; Next + Storyblok obvious on a CV | Longer; not a “product” slug |
| `storyblok.marcopontili.com` | Short, CMS-first | Looks slightly “official”; no Next in the host |
| `headless.marcopontili.com` | Role signal | Vague; no vendor names |
| `northline.marcopontili.com` | Matches in-app brand | **Rejected for now:** hides stack on the URL |

Default in the rest of this plan until you pick: **`nextstory.marcopontili.com`**. Swap the string everywhere once chosen.

**Better path locked (not md2pdf FTP):** md2pdf deploys a static `dist/` to Netsons cPanel via SFTP/FTPS. This app uses `draftMode`, `/api/preview`, `/api/revalidate`, and server CDN fetches. Static export would drop the portfolio differentiator. Phrase-class stack was Next.js / Storyblok / **Vercel**. Deploy on **Vercel**; put **DNS** on Cloudflare (`<host>.marcopontili.com` CNAME → Vercel). Reuse md2pdf/bullframe patterns for **CI, changelog lint, brand kit, About/topics**, not for FTP upload.

## Assumptions tested

| Assumption | Check | Result | Consequence |
| --- | --- | --- | --- |
| md2pdf deploy fits this app | Read md2pdf `deploy.yaml`; grep this repo for `draftMode` / `api/preview` | FTP mirrors static `dist/`; this app needs Node for preview + webhook | Do **not** copy FTPS deploy; use Vercel |
| `northline.marcopontili.com` is the right host | Audience = stack/workflow proof; siblings are product slugs | Fictional brand in the URL hides Next/Storyblok | Prefer **stack host** (`next-storyblok` default); keep Northline in-page only |
| GitHub secrets alone host Storyblok | Vercel vs GitHub env model | Runtime secrets belong on the host (Vercel); GitHub secrets only if Actions need them | Marco adds **Vercel env** (Storyblok + preview/revalidate secrets). GitHub: social image (+ optional CI-only secrets). No FTPS secrets |
| Brand kit pattern exists | wp-agent-harness `.github/brand/` | `readme-light`/`readme-dark` 2560×1280, `social` 1280×640, `og` 1200×630 | Copy that kit layout |
| Changelog voice | bullframe `CHANGELOG.md` | Keep a Changelog, imperative, ≤120 chars | Port lint + guide style |
| Space still has starter blocks | Seed run + teaser/grid adapters in `src/lib/storyblok.ts` | Seed created Northline bloks; teaser/grid unused | Delete in Storyblok; drop adapter components after |
| Repo can go public | `git remote -v` empty; under `private/` folder | No remote yet | Create public GitHub repo (name **`northline`**), first commits on `feat/*` then `main` after CI green |

## Dependencies

- Storyblok space `295862282921450` (EU) + delivery token in project `.env`
- PAT in `~/.config/mcp-env/STORYBLOK_PERSONAL_ACCESS_TOKEN` (seed already used)
- Cloudflare + cPanel sessions available for DNS (Playwriter); Vercel account for Marco
- Marco manual: (1) upload GitHub social preview image (2) set Vercel project env vars (and confirm custom domain)

## Changes

### 0. Polish (before public)

- Delete Storyblok starter components `teaser` / `grid` (UI or Management API).
- Remove `Teaser.tsx` / `Grid.tsx` and map entries from [`src/lib/storyblok.ts`](../src/lib/storyblok.ts).
- Generate and set `STORYBLOK_PREVIEW_SECRET` + `STORYBLOK_REVALIDATE_SECRET` in local `.env` (utf8 no BOM); same values later on Vercel.
- Wire Storyblok Visual Editor preview URL to production (and optional localhost HTTPS) after domain is live.

### 1. Repo packaging

- Flip `"private": false`; version `0.1.0` initial release track.
- Public GitHub repo: keep **`marketing-site-storyblok`** (or `next-storyblok`) so the repo name also carries stack signal; homepage = chosen `*.marcopontili.com` host.
- Branch model: `develop` integration + `main` production (match md2pdf/bullframe), or single `main` if keeping lean; prefer **`main` + `develop`** for CI-on-PR and deploy-on-main.
- Files: `LICENSE` (MIT unless otherwise chosen), `CHANGELOG.md` (bullframe preamble), `CONTRIBUTING.md` short, `docs/` (schema already; add architecture + commands).
- README via **repo-readme** skill: light/dark heroes, pitch for employers, Quick start, What this proves (CMS workflow table), stack badges, link to live site + schema doc. Topics: `nextjs`, `storyblok`, `headless-cms`, `app-router`, `marketing-site`, `vercel`, …

### 2. Brand assets (`.github/brand/`)

- Follow wp-agent-harness kit: `readme-light.png` / `readme-dark.png`, `social.png`, `og.png` (+ SVG sources if generated).
- Site metadata / OG points at brand OG.
- Marco uploads `social.png` in GitHub Settings → Social preview (API cannot set custom OG image reliably the same way).

### 3. CI / changelog / releases

- `.github/workflows/ci.yml`: `npm ci` → lint → test (add minimal smoke: `fetch-story` / build) → `changelog:lint` → `npm run build`.
- Port a slim `scripts/changelog-lint.mjs` + npm scripts from bullframe/md2pdf.
- Dependabot for npm + Actions.
- Releases: tag `v0.1.0`, notes = changelog section (manual `gh release create` like md2pdf).

### 4. Deploy (Vercel) + DNS (Cloudflare)

- Connect repo to Vercel; framework Next.js; env:
  - `STORYBLOK_DELIVERY_API_TOKEN`
  - `STORYBLOK_REGION=eu`
  - `STORYBLOK_VERSION=published` (production)
  - `STORYBLOK_PREVIEW_SECRET`
  - `STORYBLOK_REVALIDATE_SECRET`
- Custom domain = chosen host (default `nextstory.marcopontili.com`).
- Playwriter: Cloudflare DNS CNAME for that label → Vercel target; proxy as sibling hosts.
- cPanel/Netsons: **no** FTP docroot for this app. DNS-only.
- Storyblok webhook → `https://<host>/api/revalidate?secret=…`
- Storyblok preview → `https://<host>/api/preview?secret=…&slug=home`

### 5. GitHub About

- Description (METADATA bounds): short headless marketing-site blurb.
- Homepage URL: live Northline.
- Topics as above; clear wiki/projects noise if any.
- Social image: Marco uploads.

### 6. First commits (after packaging is ready)

- Feature branch `feat/public-demo` off empty/`main`; commits: app scaffold, CI/docs/brand, no secrets.
- Open PR → CI green → merge → Vercel production.
- No agent attribution on commits/PRs.

## Files

| Path | Status |
| --- | --- |
| `docs/plan-northline-public-2026-10-13.md` | this plan (new) |
| `docs/storyblok-schema.md` | exists; keep |
| `docs/architecture.md`, `docs/commands.md` | new |
| `README.md` | rewrite |
| `CHANGELOG.md`, `scripts/changelog-lint.mjs` | new |
| `.github/workflows/ci.yml`, `dependabot.yml` | new |
| `.github/brand/*` | new |
| `src/components/Teaser.tsx`, `Grid.tsx` | remove after Storyblok cleanup |
| `next.config.ts` / layout metadata | OG URL updates |
| Vercel + Cloudflare | external |

## Verification

- `npm run build` and CI green on PR.
- `https://<host>` → published Storyblok home (no mock).
- `/pricing` 200; `/api/preview?secret=…&slug=home` enables draft; webhook revalidate refreshes after publish.
- README shows light/dark heroes; About + topics + homepage set; social image present after Marco upload.
- `CHANGELOG` lint passes; `v0.1.0` release notes match changelog.

## Marco-only steps

1. Upload GitHub **social preview** image from `.github/brand/social.png`.
2. Set **Vercel** env vars (Storyblok delivery + preview/revalidate secrets) and confirm domain.

Everything else (DNS via Playwriter, repo create, CI, README, brand art, Storyblok webhook/preview URLs, polish) is agent-executable once this plan is approved to run.
