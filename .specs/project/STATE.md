# Project State

## Decisions

- i18n uses `hideLocale: 'never'` (every locale prefixed: `/en/`, `/pt/`, `/es/`) because this site is a static export (GitHub Pages, no server) and Fumadocs' `hideLocale: 'default-locale'` requires Next.js Middleware rewrites. See `.specs/features/i18n/context.md`.
- Locale codes are short (`en`/`pt`/`es`), not region-qualified — matches Fumadocs' own convention; register (Brazilian Portuguese, neutral Spanish) is a content decision, not a routing one.
- The default (English) locale needs **no filename suffix** — only `pt`/`es` overrides get `.pt.mdx`/`.es.mdx` siblings. This corrected an earlier (external, GEMINI.md-sourced) assumption that all ~43 existing pages would need renaming.
- The static search index (`/api/search`) is a **single shared route**, not one per locale — `createFromSource(source, {localeMap}).staticGET()` already produces one combined `{type:'i18n', data:{en,pt,es}}` file once the source loader is i18n-aware. This corrected the original `.specs/features/i18n/design.md` assumption (per-locale routes under `app/[lang]/api/search`), found by inspecting the installed `fumadocs-core` types directly rather than trusting a docs snippet at face value.

## Completed (i18n feature, ROADMAP.md M5)

- Full i18n infrastructure: `defineI18n` config, i18n-aware source loader, routes restructured under `app/[lang]/...` (home, docs, OG images, llms.txt/llms-full.txt/llms.mdx), root `/` browser-language redirect page, shared per-locale search index, built-in Fumadocs language switcher (path-preserving, zero custom code needed).
- Home page + full Getting Started section (5 pages) + docs root index translated to pt and es (the docs-index and GS translations were contributed by a parallel Gemini CLI session per the repo's `.agents/` support tooling; verified for correctness — right file-naming convention, code blocks untouched, zero leftover English in prose — before accepting).
- Verified via `pnpm build` (400 static pages), grep-based content checks, and rendered-HTML spot-checks. NOT manually click-tested in a real browser (no browser tooling available this session) for the language switcher round-trip or the root redirect's language-detection branches — flagged as a follow-up manual QA pass before calling i18n fully signed off.

## Deferred / Follow-up

- ~38 remaining English pages (Core Concepts, Request Pipeline, Validation, Multipart, OpenAPI, Emitter, Scheduler, Health Checks, Testing, API Reference) are NOT yet translated to pt/es — they render via Fumadocs' automatic English fallback (verified working, e.g. `/pt/docs/emitter`). Tracked in ROADMAP.md `Future Considerations`, not a v1 blocker.
- Manual browser QA recommended for: language switcher path-preservation across a real click-through, and root `/` redirect across real `navigator.language` values (en, pt, es, and one unsupported locale).
- Fumadocs' own built-in UI chrome strings (search dialog placeholder, "Table of contents", etc.) are NOT localized — out of scope for this feature (only page content + hero/footer were in scope).

## Preferences

- Lightweight/bookkeeping tasks (STATE.md updates, ROADMAP.md updates, validation passes) work well with faster/cheaper models — consider routing these to a lighter model in future sessions.
