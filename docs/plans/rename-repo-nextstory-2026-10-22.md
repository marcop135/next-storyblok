# Rename GitHub repo `next-storyblok` to `nextstory`

## Context
The site and project already use the Next Story brand (`nextstory.marcopontili.com`). The repository is the only thing still called `next-storyblok`. The goal is for GitHub, the site, the CMS, the docs, Vercel, the profile README and the local folder to all say `nextstory`, so that no link depends on GitHub's redirect and no README badge ever shows "repo not found".

Badge strategy: `github.com/<repo>` renders the README from `main`. The plan therefore prepares and checks everything before the rename, then merges the `main` promotion within the same minute as the rename. The new badge URLs are new cache keys at shields.io and camo, and they are first fetched only after the rename.

## Assumptions tested
| Assumption | Check | Result | Consequence |
|---|---|---|---|
| `gh` can rename | `gh repo rename --help` | `-R/--repo`, `-y/--yes` | Use `gh repo rename nextstory -R marcop135/next-storyblok -y` |
| The name is free | `gh repo view marcop135/nextstory` | "Could not resolve" | Proceed |
| Nothing blocks it on GitHub | rulesets, branch protection, hooks, environments, secrets | None, except environments `Preview` and `Production` (Vercel), which move with the repo | No extra steps |
| Vercel follows the rename | `vercel api /v9/projects/next-storyblok` | `link.repoId: 1416997790`, `productionBranch: main` | Link is ID-based; production deploy after merge is the proof |
| Vercel MCP can manage the project | `get_project`, `list_projects` | 404; MCP sees only `fe-design-system` | Use the Vercel CLI (64.5.0, authed), not the MCP |
| CLI `project update` can rename | `vercel project update --help` | No name option | Rename with `vercel api -X PATCH /v9/projects/<id> -f name=nextstory` |
| Renaming changes the `vercel.app` hosts used by the CMS | project domains | `next-storyblok-eight.vercel.app` is an assigned project domain; `next-storyblok.marcopontili.com` already 308s to `nextstory.marcopontili.com` | Both survive the rename; leave them alone |
| Storyblok credentials exist locally | `node --env-file=.env` | No `.env` in the repo (`.env*` is gitignored) | User must create `.env` with `STORYBLOK_PERSONAL_ACCESS_TOKEN` and `STORYBLOK_SPACE_ID` before the CMS step |
| Live CMS matches the seeds | WebFetch of the live `/` and `/how-it-works` | Live links mix CMS and code (`REPO_URL` via `Step`, `CodeExample`) | Do not assert seed counts; patch by field key and scan every story |
| Direct push to `main` is possible from the agent | `settings.json` deny list | `Bash(git push origin main *)` is denied | The user runs the profile push via `!` |
| The release flow | PRs #45–48, `docs/development-cycle.md` §Cut and promote | feature → `develop` (squash); `release/x.y.z` → `main` (merge); then fast-forward `develop`; annotated tag; release `[x.y.z] - date` | Mirror exactly; version `0.8.2` (current `0.8.1`, patch) |
| `REPO_URL` reach | grep `src` | `for-agents/page.tsx`, `CodeExample.tsx`, `Step.tsx`, `agent-resources.ts` | One edit in `src/lib/site.ts` covers all of them |
| codebase-memory indexes this repo | `list_projects` | Not indexed | No re-index step |
| GSC needs a resubmit | `list_properties` | `sc-domain:marcopontili.com`; the site URL is unchanged | No step; the redirect and the refreshed `llms.txt` cover it |
| Build caches survive a folder move | `git check-ignore` | `.next/`, `*.tsbuildinfo` and `.vercel` are ignored and hold absolute paths | Delete `.next` and `tsconfig.tsbuildinfo` after the move |

## Changes

### 0. Pre-flight (read-only)
- Run `git fetch`, `git status` and `git worktree list` in both repos. `next-storyblok` should be on `develop` at `4e10772`, `marcop135` on `main` at `77e95ad`, both clean.
- **User prerequisite:** create `.env` in the repo root with `STORYBLOK_PERSONAL_ACCESS_TOKEN` and `STORYBLOK_SPACE_ID`.
- Run the read-only probe `node --env-file=.env <scratchpad>/sb-probe.mjs`. It reads the space preview domain and environments, the webhook endpoints, and every story's count of `next-storyblok`, plus `unpublished_changes` and `updated_at`. Any preview or webhook URL that contains `next-storyblok` is added to step 4.

### 1. Prepare (all before the rename)
- **Feature PR** on `feat/rename-repo-nextstory`, branched from `develop`:
  - Replace `marcop135/next-storyblok` with `marcop135/nextstory` in:
    - `src/lib/site.ts:3`
    - `README.md` (CI badge, release badge, issues link)
    - `public/llms.txt`
    - `public/.well-known/security.txt`
    - `.github/ISSUE_TEMPLATE/config.yml`
    - `storyblok/stories/home.json`
    - `storyblok/stories/how-it-works.json`
  - Set `"name": "nextstory"` in `package.json` and both `package-lock.json` name fields. Edit by hand.
  - Add a CHANGELOG Unreleased `### Changed` bullet: `Rename the repository to nextstory and point every repository link at it.`
  - Commit this plan as `docs/plans/rename-repo-nextstory-2026-10-22.md`.
  - `git grep -n next-storyblok` must match only `CHANGELOG.md:67`, `docs/plans/animated-blocks-agents-2026-10-20.md` and this plan.
  - Gates: `npm run lint`, `test`, `build`, `changelog:lint`, `storyblok:types:check`. Then run `npm run start` on a free port (check with `netsh int ipv4 show excludedportrange protocol=tcp`; `lsof` on macOS, `ss -ltn` on WSL), then `npm run smoke -- http://localhost:<port>` and `npm run verify:agent-readiness -- http://localhost:<port>`. Stop that PID. Run `git status` and revert any artifacts.
  - Push, open the PR into `develop`, wait for CI and the Vercel preview, then squash-merge. The `develop` README points at the new path a few minutes early, which nobody sees.
- **Release PR:** cut `release/0.8.2` from `develop` and commit `chore(release): cut 0.8.2 with repository rename` with the version bump and changelog section. Rerun the gates, open the PR into `main`, and wait for green checks and a diff review. **Do not merge yet.**
- **Profile repo:** in `C:\Users\marco\code\github\public\marcop135\README.md:15`, change only the link text and URL to `**[marcop135/nextstory](https://github.com/marcop135/nextstory)**`. Commit `docs: link renamed nextstory repo` locally. **Do not push yet.**
- **CMS script:** write `rename-links.mjs` to the scratchpad and run it with `--dry-run` (see step 3).

### 2. Rename and land (one sitting, about 2 minutes)
1. `gh repo rename nextstory -R marcop135/next-storyblok -y`
2. `git remote set-url origin https://github.com/marcop135/nextstory.git`, then `git fetch`.
3. `gh pr merge <release PR> --merge`
4. The user runs `! git -C C:/Users/marco/code/github/public/marcop135 push origin main`. The deny rule blocks the agent from running it.
5. Confirm that `https://github.com/marcop135` links to `nextstory`. Do not open the repo page until the release in step 3 exists. Then both badges render real values on their first fetch: CI green, release `v0.8.2`.

### 3. Production and CMS
- Run `git fetch` right after the merge, so every ref below is the post-merge `main`.
- The production deployment of the merge commit must start within about 3 minutes (`vercel ls --scope marcop135`). If it doesn't, reconnect `marcop135/nextstory` in Vercel Git settings and redeploy. The previous build keeps serving the site meanwhile.
- As soon as that deployment is Ready, tag and release immediately, so the release badge never reports 0.8.1: `git tag -a v0.8.2 origin/main -m "Release 0.8.2"`, `git push origin v0.8.2`, then `gh release create v0.8.2 --verify-tag --target main --title "[0.8.2] - 2026-10-22" --notes-file <notes>`. Steps 2.5 and this one run in the same sitting. Badges are checked after the release exists.
- Fast-forward `develop`: `git push origin origin/main:refs/heads/develop` (no force). `git fetch` again; `main`, `develop`, their remote refs and `v0.8.2^{}` must resolve to the same SHA.
- Use WebFetch to check `/`, `/de`, `/how-it-works`, `/de/how-it-works`, `/for-agents`, `/llms.txt` and `/.well-known/security.txt` for `nextstory` links. Code-driven links switch now; CMS links switch after the next step.
- **CMS surgical patch** (`rename-links.mjs`). It never calls `storyblok:push` or `syncSpace`, which overwrite whole stories and PUT every component. It reuses the `request()` retry and rate-limit pattern from `scripts/storyblok-push.mjs`. For every story the probe flagged:
  1. `GET /stories/<id>`. If `unpublished_changes` is true, stop for that story and report it, because saving would publish an unreviewed draft.
  2. Write the full story to the scratchpad as `backup-<slug>-<timestamp>.json`.
  3. Walk `content`. Replace `https://github.com/marcop135/next-storyblok` with `https://github.com/marcop135/nextstory` only in string values whose key matches `/href|^url$|^cached_url$/i` (including `__i18n__de` variants, and Storyblok multilink `url`/`cached_url`), and print each JSON path changed. If the old string still appears anywhere else in `content`, stop without writing.
  4. Default mode is `--dry-run`, which prints the paths only. The real run does `PUT /stories/<id>` with `publish: 0`, so the change is saved as a draft.
  5. `GET` again. If `updated_at` changed since step 1 for any reason other than this PUT (compare against the PUT response), stop.
  6. `GET /stories/<id>/publish`. Then use WebFetch on the EN and DE pages and `.md` routes after webhook revalidation.
  - Rollback: `PUT` the backup's `content` with `publish: 1`. Storyblok version history is the second fallback.
  - Final probe run: zero stories contain `next-storyblok`.

### 4. Vercel project rename
- The probe found one webhook that still uses the old host: `next-storyblok-revalidate`, which points at `https://next-storyblok.marcopontili.com/api/revalidate?...` and only reaches the site through the 308 redirect. Update its endpoint host to `nextstory.marcopontili.com` (keep the query string) and rename it `nextstory-revalidate`, via `PUT /webhook_endpoints/<id>`. The preview domain is the default `quickstart.me.storyblok.com`, so it needs no change.
- The user runs `! vercel api -X PATCH /v9/projects/prj_2JaUvcGIccEGfTKaC3vf9VcCmpTc -f name=nextstory --scope marcop135`. The workspace guard misreads `/v9/...` as a filesystem path, so the agent cannot run it.
- `vercel project inspect nextstory --scope marcop135` must show the new name, and the domains `nextstory.marcopontili.com`, `next-storyblok.marcopontili.com` (308) and `next-storyblok-eight.vercel.app` must be unchanged.
- Open the Storyblok visual editor on `home`; the preview must load.
- Set `projectName: "nextstory"` in the local `.vercel/project.json`.

### 5. Wrap-up and local folder (last, because the folder is this session's cwd)
- Delete the merged `feat/rename-repo-nextstory` and `release/0.8.2` branches, local and remote.
- Write project memories, each linked from `MEMORY.md`:
  - the user granted direct pushes to `main` for `marcop135/marcop135` only, in this conversation on 2026-10-22, and the push itself is still run by the user because of the deny rule;
  - never re-create a repo named `next-storyblok`, because that breaks the redirect.
- The user closes this session, VS Code windows on the folder, and any dev server, then runs:
  - `mv /c/Users/marco/code/github/public/next-storyblok /c/Users/marco/code/github/public/nextstory`
  - `mv /c/Users/marco/.claude/projects/C--Users-marco-code-github-public-next-storyblok /c/Users/marco/.claude/projects/C--Users-marco-code-github-public-nextstory`
  - `rm -rf .next tsconfig.tsbuildinfo` inside the new folder.
  - On macOS and WSL, the same `mv` and `rm` commands work with those platforms' paths.
- Start a new `claude` session in the new folder. Trust and permission prompts appear once, because `~/.claude.json` keys them by path.

## Files
- **Edited:**
  - `src/lib/site.ts`
  - `README.md`
  - `public/llms.txt`
  - `public/.well-known/security.txt`
  - `.github/ISSUE_TEMPLATE/config.yml`
  - `storyblok/stories/home.json`
  - `storyblok/stories/how-it-works.json`
  - `package.json`
  - `package-lock.json`
  - `CHANGELOG.md`
  - `marcop135/README.md`
- **New:** `docs/plans/rename-repo-nextstory-2026-10-22.md`
- **Scratchpad only:** `sb-probe.mjs` (exists), `rename-links.mjs`, the story backups.

## Verification
- `gh repo view marcop135/nextstory` succeeds, `github.com/marcop135/next-storyblok` redirects to it, and `git fetch` works in both clones.
- Both badges on the repo page show real values immediately after the merge; there is never a "repo not found" state.
- Production runs the 0.8.2 merge commit. `main` and `develop` are at the same SHA. The `v0.8.2` tag and its GitHub release point at that commit.
- The live EN and DE pages, `/for-agents`, `/llms.txt` and `/.well-known/security.txt` contain `nextstory` links and no `next-storyblok` link.
- The final probe finds zero CMS stories with `next-storyblok`. Backups differ from the published stories only in the printed href paths.
- The Storyblok visual editor previews `home` after the Vercel rename.
- `git grep next-storyblok` matches only the history lines and the plan files.
