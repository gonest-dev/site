# Roadmap

**Current Milestone:** M1 — Site Foundation & Core Content
**Status:** Planning

---

## M1 — Site Foundation & Core Content

**Goal:** Fumadocs site scaffolded, themed, deployable; navigation IA in place; Getting Started + Core Concepts (DI/Modules/Controllers) fully written and accurate.
**Target:** First deployable preview

### Features

**docs-site** - PLANNED

- Next.js + Fumadocs scaffold (`create-fumadocs-app` or manual install)
- Dark-first theme matching better-auth/Hono/Drizzle polish (custom CSS vars, fonts, accent color)
- Minimal sidebar navigation IA (sections mirroring gonest's capability areas)
- Instant search (Fumadocs built-in, Orama)
- Simple hero landing page (tagline, quickstart snippet, CTA to docs)
- Custom MDX components: Callout, Steps, Tabs, Cards wired into `mdx-components.tsx`
- Getting Started page (install, quickstart, 3-phase bootstrap explanation)
- Core Concepts pages: Modules, Providers, Controllers & Routes, DI Scopes, Multi-binding

---

## M2 — Request Pipeline & Validation Docs

**Goal:** All pipeline stages and the schema/validation system fully documented with accurate examples.

### Features

**pipeline-docs** - PLANNED

- Middleware, Guard, Interceptor, Filter pages (execution order diagram)
- Exceptions & panic recovery page (HttpException, built-ins, custom exceptions)

**validation-docs** - PLANNED

- Schema builder core (`NewSchema[T]`, `Property(&t.X)`, base constraints)
- String/Numeric/Boolean/DateTime branch family reference
- Array Builder (dual-state container/item) page
- Object Builder page
- Runtime validation page (params/query/JSON body, `Custom(fn)` escape hatch)
- Multipart Form Streaming page

---

## M3 — Platform Features & API Reference

**Goal:** OpenAPI/Swagger, Emitter, Scheduler, Terminus, Testing documented; full API reference section complete.

### Features

**platform-docs** - PLANNED

- OpenAPI/Swagger generation page
- Event Emitter page
- Scheduler page
- Health Checks (Terminus-style) page
- Testing helpers page (`MustNewTestApp`, `MustOverride`, `MustRequest`)

**api-reference** - PLANNED

- Structured reference pages for every exported symbol in the content map

---

## M4 — Interactivity

**Goal:** WASM playground and hosted live demo API embedded across relevant docs pages.

### Features

**wasm-playground** - PLANNED

- Go→WASM build pipeline for schema/validation scenarios
- In-browser editor + live output component (no network)
- Embedded on Schema/Validation pages

**live-demo-api** - PLANNED

- Deploy `.examples/blog-api` as a small hosted demo service
- "Try it" request panel component (method/path/body editor, real response)
- Embedded on Pipeline, Guard/Auth, OpenAPI pages

---

## M5 — Internationalization (en / pt / es)

**Goal:** Site serves en (default), pt, and es under explicit locale-prefixed
routes (`/en/...`, `/pt/...`, `/es/...`), static-export compatible (no
Middleware). Home page + full Getting Started section translated; every
other page falls back to English automatically. See
`.specs/features/i18n/spec.md`.

### Features

**i18n** - PLANNED

- `defineI18n` config + locale-aware source loader
- Routes restructured under `app/[lang]/...` (home, docs, search, OG images, llms.\*)
- Root `/` redirect page (browser-language-based, no Middleware)
- Per-locale static search index
- Home page + Getting Started (5 pages) translated to pt and es
- Remaining ~38 pages ship infra-ready, English-fallback until translated (tracked below)

---

## Future Considerations

- Versioned docs once gonest ships a tagged release
- Remaining ~38 pages translated to pt and es (Core Concepts, Request Pipeline, Validation, Multipart, OpenAPI, Emitter, Scheduler, Health Checks, Testing, API Reference)
- Release notes / changelog page
- Community/contribution pages
