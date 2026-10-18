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
npm test
npm run changelog:lint
npm run build
npm run storyblok:types:check
npm start          # then, in a second terminal: npm run smoke
```

Change blocks in `storyblok/components.json` first, then run `npm run storyblok:types` and add the React component to `src/lib/storyblok.ts`.

Add a Keep a Changelog bullet under `## [Unreleased]` for user-visible changes.

## Branches

- `develop`: integration
- `main`: production (Vercel)
- `feat/*`: work branches; open PRs into `develop`
