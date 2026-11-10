# A Caterham 420R is born

A static site cataloguing my Caterham Seven build, built with [Eleventy](https://www.11ty.dev/).

## Run locally

```bash
npm install
npm start        # http://localhost:8080 with live reload
npm run build    # outputs the static site to _site/
```

## Add a build log entry

Create `src/posts/YYYY-MM-DD-short-name.md` (the date comes from the filename):

```markdown
---
title: Front suspension fitted
stage: front-end          # must match a slug in src/_data/stages.js
cost: 120                 # optional, £
---
What I did today…

{% image "images/wishbones.jpg", "Lower wishbones fitted", "Optional caption" %}
```

Put original photos in `src/images/`. They're resized to 600/1200px WebP + JPEG at build time.

## Add a document

Drop the file into the right folder under `src/documents/` and it appears on the Documents page:

| Folder | Section |
|---|---|
| `build-manuals/` | Build manuals |
| `iva/` | IVA |
| `components/` | Component manuals (Duratec, gearbox, etc.) |
| `post-iva/` | Post-IVA fit-out (VBOX, cameras) |
| `other/` | Other |

The title comes from the filename (`duratec-workshop-manual.pdf` → "Duratec workshop manual"). To set a different title or add a description, create `src/documents/meta.json`:

```json
{
  "components/duratec-workshop-manual.pdf": { "title": "Ford Duratec workshop manual", "description": "Torque settings in section 4" }
}
```

A new sub-folder becomes a new section automatically. Section names and order are set in `src/_data/documents.js`.

## Update progress

- Stage list and status (`not-started`, `in-progress`, `done`): `src/_data/stages.js`
- Site title and car spec: `src/_data/site.js`
- About page: `src/about.md`
- Styles: `src/assets/css/style.css`

## Publishing

The live site is https://a420risborn.com, hosted on GitHub Pages.

Every change pushed to the `main` branch on GitHub is built and published automatically by
`.github/workflows/deploy.yml` (see the repository's **Actions** tab for progress). The domain is
registered at Wix, with its DNS records pointing at GitHub Pages.
