# Commands

```bash
npm install
cp .env.example .env   # then fill Storyblok tokens
npm run dev            # http://localhost:3000
npm run lint
npm run changelog:lint
npm run build
npm start              # after build
```

## Storyblok

Recreate the space schema from [storyblok-schema.md](storyblok-schema.md).

Preview (draftMode):

```text
/api/preview?secret=<STORYBLOK_PREVIEW_SECRET>&slug=home
```

Exit preview: `/api/exit-preview`

Publish webhook:

```text
POST /api/revalidate?secret=<STORYBLOK_REVALIDATE_SECRET>
```

## Brand images

```bash
npm run brand:render
```
