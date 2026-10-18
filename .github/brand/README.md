# Brand images

`readme-light.svg` and `readme-dark.svg` are the README header sources
(`readme-light.png` / `readme-dark.png`, 2560x1280), switched on GitHub via
`#gh-light-mode-only` / `#gh-dark-mode-only`. `social.svg` → `social.png`
(1280x640, GitHub Settings > Social preview). `og.svg` → `public/og.png`
(1200x630, the site's Open Graph image). All outputs are listed in
`brand.config.json`. Render with
`npx -y -p playwright@1.61.1 -p sharp@0.35.4 node .github/brand/render.mjs`
from the repository root; add `--check` to re-render in memory and exit 1 if
any source or output is stale. Palette tokens in `tokens.json` (`light` and
`dark`) follow the demo site palette in `src/app/globals.css`; the teal outline
marks the block selected in the Storyblok Visual Editor. Fraunces and Source
Sans 3 are the site's `next/font` faces, Roboto Mono sets block names, all
under the SIL OFL 1.1 (texts in `fonts/`). `render.mjs` and `embed-fonts.mjs`
are vendored from the marcopontili.com repo-brand kit; do not edit them here.
