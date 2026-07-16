# i18n — Discussed Gray Areas

## Decision 1: Locale prefix strategy under static export

**Gray area:** Fumadocs' recommended `hideLocale: 'default-locale'` (English
unprefixed at `/docs`, other locales at `/pt/docs`) relies on
`createI18nMiddleware`'s `NextResponse.rewrite` — Next.js Middleware, which
does **not run** under `output: 'export'` (GitHub Pages has no server).

**Decision:** Use `hideLocale: 'never'`. Every locale gets an explicit
prefix: `/en/...`, `/pt/...`, `/es/...`. No middleware required — this is a
pure static-generation concern, fully compatible with `output: 'export'`.

**Consequence:** The site root `/` is not itself a locale's homepage. It
becomes a minimal static redirect page (client-side, reading
`navigator.language` with a hard fallback to `/en/`) per
[FR-i18n-06](spec.md).

## Decision 2: Locale codes

**Gray area:** "the most-used Spanish in the world" doesn't map to a single
ISO code — Mexican Spanish has the most native speakers, but neutral/Latin
American Spanish (`es` / `es-419`) is the conventional choice for
documentation aimed at a broad Spanish-speaking developer audience.

**Decision:** Use short codes matching Fumadocs' own convention (`en`, `pt`,
`es`), not region-qualified tags (`pt-BR`, `es-419`). `pt` content is written
in Brazilian Portuguese register; `es` content is written in neutral/Latin
American Spanish register — this is a content/authoring decision, not a
routing one, and doesn't require a 4th locale code.

## Decision 3: v1 translation scope

**Gray area:** ~43 English pages exist today; translating all of them
upfront is a large, low-verifiability content task disconnected from the
infra work itself.

**Decision:** v1 ships the full i18n **infrastructure** (routing, config,
language switcher, per-locale search) working end-to-end, plus **full pt and
es translations for the Home page and the entire Getting Started section**
(5 pages: index, installation, quickstart, bootstrap, examples) as the
proof-of-correctness slice. Every other page ships infra-ready but
untranslated — Fumadocs' automatic fallback-to-English kicks in
transparently, so nothing breaks or 404s. Remaining translations become
follow-up content tasks (tracked in ROADMAP.md), not blocking v1 sign-off.
