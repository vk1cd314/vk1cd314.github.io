# Systems Notebook

Minimal personal site built with **Next.js 16 (App Router)** and Tailwind CSS v4. It ships with three primary pages — Home/About, Problems, and Research — plus individual detail views sourced from Markdown. The layout leans into a neo-brutalist palette: inky background, electric blue accents, chunky borders, and crisp typography at 18–20px.

## Tech stack

- Next.js 16 with the App Router
- Tailwind CSS v4 (via the `@import "tailwindcss"` runtime)
- Markdown content parsed server-side with `gray-matter`, `remark`, and `remark-html`
- TypeScript throughout

## Scripts

```bash
npm run dev      # start the local dev server
npm run build    # create a production build
npm run preview  # build + start the production server locally
npm run start    # start the already-built production server
npm run lint     # lint the project
```

## Project structure

```
src/
  app/                 # App Router pages
  components/          # Layout, navigation, sections, UI primitives
  data/author.ts       # Single source of truth for hero + profile details
  lib/content.ts       # Markdown loaders + helpers
  types/content.ts     # Shared types for markdown frontmatter
content/
  problems/*.md        # Problem entries
  research/*.md        # Research notes
public/author-avatar.svg
```

## Editing author info

All hero/homepage details live in `src/data/author.ts`. Update the `name`, `title`, `description`, `statement`, `socials`, etc. there and the UI refreshes everywhere.

## Adding a new post

Both Problems and Research entries share the same markdown schema. Drop a new `.md` file inside the relevant folder and it will automatically show up on the list pages (sorted by `date` descending).

```md
---
title: "Descriptive Title"
date: "2025-02-21"
tag: "Platform • Tooling"
summary: "Short card subtext that teases the deeper write-up."
---

## Markdown body

All standard Markdown + GFM is supported (headings, lists, tables, blockquotes, etc.).
```

1. Problems → `content/problems/<slug>.md`
2. Research → `content/research/<slug>.md`

The filename becomes the slug used in the URL.

## Changing the theme

Global colors, typography, and article styles live in `src/app/globals.css`. Update the CSS custom properties at the top of the file (e.g., `--background`, `--accent`, `--accent-strong`, `--border`) to adjust the palette. Because Tailwind v4 reads those variables, the entire site (components, cards, nav) will pick up the new colors automatically.

## Deployment notes

- The site is static-friendly: content is read at build time and routed via `generateStaticParams`.
- Adding, editing, or deleting markdown files only requires rerunning `npm run build`.
- No additional CMS or database is required, keeping edits fast and version-controlled.
