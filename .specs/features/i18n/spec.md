# i18n (Internationalization) Specification

## Problem Statement

The gonest docs site currently ships English-only content. gonest targets
JS/TS developers migrating to Go worldwide, and a large share of that
audience reads Portuguese (Brazil) or Spanish more comfortably than English.
The site must serve en-US (default), pt (Brazilian Portuguese), and es
(neutral/Latin American Spanish) — using Fumadocs' native i18n support,
compatible with the site's existing static export (GitHub Pages, no server,
no middleware — see [context.md](context.md) Decision 1).

## Goals

- [ ] Every route (home + all docs pages) exists under an explicit locale
      prefix (`/en/...`, `/pt/...`, `/es/...`) and builds correctly under
      `output: 'export'`.
- [ ] A language switcher is reachable from every page and preserves the
      current page when switching locale (not just bouncing to a locale's
      homepage).
- [ ] Search is scoped per locale — searching in `/pt/docs` never surfaces
      English-only titles/content as false matches.
- [ ] Home page + full Getting Started section ship with real pt and es
      translations (see [context.md](context.md) Decision 3); every other
      page falls back to English automatically, with zero broken links or
      404s.

## Out of Scope

| Feature | Reason |
|---|---|
| Translating all ~43 existing pages | Large, ongoing content effort — decoupled from infra (context.md Decision 3) |
| Region-qualified locale codes (`pt-BR`, `es-419`, `en-US` in the URL) | Short codes (`en`/`pt`/`es`) match Fumadocs' own convention; register is a content decision (context.md Decision 2) |
| Auto-detecting and redirecting on every navigation | No middleware under static export; only the root `/` gets a one-time client-side language guess (FR-i18n-06) |
| Translating the WASM playground / live demo API UI strings (future feature, not yet built) | Not part of this site yet — tracked separately when that feature ships |
| A CMS or external translation-management tool | Out of scope; translations are authored directly as MDX files in this repo |

---

## User Stories

### P1: Read the docs in my language, with a URL that says so ⭐ MVP

**User Story**: As a Portuguese or Spanish-speaking developer, I want to
browse `/pt/docs/...` or `/es/docs/...` and see the site chrome (nav,
sidebar, search placeholder, footer) in my language, so the site feels
native rather than bolted-on.

**Why P1**: This is the entire point of the feature — without working
locale-prefixed routing, nothing else matters.

**Acceptance Criteria**:

1. WHEN a visitor requests `/en/`, `/pt/`, or `/es/` THEN the system SHALL
   render that locale's homepage.
2. WHEN a visitor requests `/en/docs/...`, `/pt/docs/...`, or
   `/es/docs/...` for any existing page THEN the system SHALL render that
   page — in the requested locale if a translation exists, in English
   otherwise (automatic fallback).
3. WHEN the static site is built (`pnpm build` with `output: 'export'`)
   THEN the system SHALL emit static HTML for all 3 locales × all pages
   with zero build errors and zero reliance on Next.js Middleware.

**Independent Test**: `pnpm build`, inspect `out/en/docs/`, `out/pt/docs/`,
`out/es/docs/` all exist with the full page set; open a translated page
(e.g. `out/pt/index.html`) and confirm Portuguese content renders.

---

### P1: Switch language without losing my place ⭐ MVP

**User Story**: As a reader on `/en/docs/validation/array-builder`, I want
to switch to Portuguese and land on
`/pt/docs/validation/array-builder` (or its English fallback if
untranslated) — not get bounced to the Portuguese homepage.

**Why P1**: A language switcher that discards navigation context is a
known, common i18n UX failure and would undermine the whole feature.

**Acceptance Criteria**:

1. WHEN a user opens the language switcher on any page THEN the system
   SHALL list all 3 locales with a clear indicator of the current one.
2. WHEN a user selects a different locale THEN the system SHALL navigate to
   the same page path under the new locale prefix.
3. WHEN the target page has no translation in the newly selected locale
   THEN the system SHALL still land on that path (serving the English
   fallback content) rather than erroring or redirecting elsewhere.

**Independent Test**: From `/en/docs/emitter` (untranslated in v1), switch
to Portuguese; land on `/pt/docs/emitter` showing English fallback content,
not a 404 and not `/pt/`.

---

### P1: Search stays inside my language ⭐ MVP

**User Story**: As a reader searching from a `/pt/...` page, I want results
scoped to Portuguese (falling back to English per-page as everywhere else),
not a mixed pile of English titles I can't read.

**Why P1**: Fumadocs' search is a core previously-shipped feature
([DOCS-02](../docs-site/spec.md)); i18n must not silently regress it.

**Acceptance Criteria**:

1. WHEN a user searches from a page under `/pt/...` THEN the system SHALL
   query the Portuguese-locale search index.
2. WHEN a user searches from a page under `/en/...` THEN the system SHALL
   query the English-locale search index.
3. WHEN the static search index is built THEN the system SHALL produce one
   index per configured locale (3 total), each pre-rendered as a static
   file compatible with `output: 'export'` (same mechanism as
   [DOCS-02](../docs-site/spec.md)'s `staticGET` — see
   `.specs/features/docs-site/design.md`).

**Independent Test**: Build the static site, inspect the exported search
index files — confirm 3 distinct locale-scoped indexes exist; searching a
Portuguese-only term from `/pt/...` returns the translated page.

---

### P1: Root `/` sends visitors to a sensible locale ⭐ MVP

**User Story**: As a first-time visitor hitting the bare domain root, I
want to land on a locale that makes sense (my browser's language if it's
one of the 3 supported, English otherwise) without a broken or blank page.

**Why P1**: Every existing internal/external link to the bare root (e.g.
the current README, bookmarks, search engines) must keep working after this
restructure.

**Acceptance Criteria**:

1. WHEN a visitor requests `/` THEN the system SHALL serve a minimal static
   page that redirects (client-side) to `/en/`, `/pt/`, or `/es/` based on
   `navigator.language`, defaulting to `/en/` for anything else.
2. WHEN JavaScript is disabled or fails THEN the system SHALL still expose a
   plain link to `/en/` on that same root page (no fully-blank dead end).

**Independent Test**: Load `/` with browser language set to `pt-BR`, confirm
redirect to `/pt/`; with JS disabled, confirm a visible fallback link to
`/en/` exists.

---

### P2: Home page and Getting Started fully translated

**User Story**: As a Portuguese or Spanish reader following the onboarding
path (home → Getting Started), I want every word — not just the site
chrome — in my language, so my very first experience with gonest has zero
English-fallback gaps.

**Why P2**: Proves translation quality/workflow end-to-end on the highest-traffic
path; the rest of the content catalog is explicitly deferred
(context.md Decision 3).

**Acceptance Criteria**:

1. WHEN a user visits `/pt/` or `/es/` THEN the system SHALL show a fully
   translated home page (hero copy, capability cards, footer strings).
2. WHEN a user visits any of the 5 Getting Started pages under `/pt/docs/...`
   or `/es/docs/...` THEN the system SHALL show fully translated prose —
   code blocks/identifiers stay in Go (untranslated, as expected).

**Independent Test**: Visually diff `/pt/` and `/es/` home + all 5 Getting
Started pages against their English counterparts — no residual English
prose (code samples excluded).

---

## Edge Cases

- WHEN a translated page's frontmatter (`title`/`description`) is
  translated but the body isn't (or vice versa) THEN the system SHALL still
  render without error — partial translation is a content-quality issue,
  not a build break.
- WHEN a new page is added in English only THEN the system SHALL
  automatically include it in `/pt/...` and `/es/...` via fallback, with no
  extra step required to "enable" it for those locales.
- WHEN `meta.json` (section ordering/titles) has no locale-suffixed
  override THEN the system SHALL fall back to the default English
  `meta.json` for that section in every locale.
- WHEN the OG image / `llms.txt` / `llms-full.txt` / `llms.mdx` routes
  (existing features from `docs-site`) are generated for a
  locale-restructured tree THEN the system SHALL keep producing valid
  output per locale without regressing the non-i18n behavior documented in
  `.specs/features/docs-site/design.md`.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---|---|---|---|
| i18n-01 | P1: Locale-prefixed routing builds statically | Design | Pending |
| i18n-02 | P1: Language switcher preserves current page | Design | Pending |
| i18n-03 | P1: Per-locale search | Design | Pending |
| i18n-04 | P1: Root `/` redirect | Design | Pending |
| i18n-05 | P2: Home + Getting Started fully translated (pt, es) | Design | Pending |

**Coverage:** 5 total, 5 mapped to design, 0 unmapped

---

## Success Criteria

- [ ] `pnpm build` succeeds with all 3 locales, zero Middleware dependency, zero broken links.
- [ ] Language switcher round-trips correctly from at least 10 spot-checked pages (translated and untranslated).
- [ ] 3 distinct static search indexes exist post-build, each scoped correctly.
- [ ] Root `/` redirects correctly for `en`, `pt`, `es`, and one unsupported browser locale (falls back to `en`).
- [ ] Home page + all 5 Getting Started pages read as fully native (no stray English) in both `/pt/` and `/es/`.
