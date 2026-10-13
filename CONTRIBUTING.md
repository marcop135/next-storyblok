# Contributing

## Setup

```bash
npm install
cp .env.example .env
```

Use a Storyblok Preview token and match `STORYBLOK_REGION` to the space. Without a token, mock stories still render.

## Checks before a PR

```bash
npm run lint
npm run changelog:lint
npm run build
```

Add a Keep a Changelog bullet under `## [Unreleased]` for user-visible changes.

## Branches

- `develop` — integration
- `main` — production (Vercel)
- `feat/*` — work branches; open PRs into `develop`
