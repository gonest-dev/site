# i18n Tasks

**Design**: `.specs/features/i18n/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1: Foundation — i18n config & source loader (Sequential)

```
T1 -> T2
```

### Phase 2: Route restructure under app/[lang] (Sequential — each depends on the i18n-aware source from Phase 1)

```
T2 -> T3 -> T4 -> T5 -> T6
```

### Phase 3: Root redirect (Parallel OK with Phase 2, both depend only on T2)

```
T2 -> T7
```

### Phase 4: Build gate for infra (Sequential, needs everything above)

```
{T6, T7} -> T8
```

### Phase 5: Home translation infra + content (Sequential)

```
T8 -> T9 -> T10 -> T11
```

### Phase 6: Getting Started translations (Parallel OK — independent files, after T8)

```
        ┌-> T12 -┐
        ├-> T13 -┤
T8 -----┼-> T14 -┼-> T17
        ├-> T15 -┤
        └-> T16 -┘
```

### Phase 7: Final verification (Sequential, needs Phase 5 + Phase 6)

```
{T11, T17} -> T18 -> T19
```

---

## Task Breakdown

### T1: Define the i18n configuration

**What**: Create `src/lib/i18n.ts` exporting `i18n` via `defineI18n({ defaultLanguage: 'en', languages: ['en', 'pt', 'es'], hideLocale: 'never' })`.
**Where**: `src/lib/i18n.ts`
**Depends on**: None
**Reuses**: N/A (new file)
**Requirement**: i18n-01

**Tools**:
- MCP: Context7 (`/llmstxt/fumadocs_dev_llms_txt`) to confirm `defineI18n` exact signature against the installed `fumadocs-core` version
- Skill: NONE

**Done when**:
- [ ] File exports `i18n` with the 3 locales and `hideLocale: 'never'`
- [ ] `pnpm run types:check` passes (no TS errors)
- [ ] Gate check passes: `pnpm lint && pnpm types:check`

**Tests**: none
**Gate**: quick

**Verify**: `pnpm types:check` exits 0; `import { i18n } from '@/lib/i18n'` resolves with no type errors anywhere it's referenced later.

---

### T2: Make the source loader locale-aware

**What**: Pass `i18n` into the existing `loader({...})` call in `src/lib/source.ts`.
**Where**: `src/lib/source.ts` (modify)
**Depends on**: T1
**Reuses**: Existing `loader()` call, `docs.toFumadocsSource()`, `lucideIconsPlugin()`
**Requirement**: i18n-01

**Tools**:
- MCP: Context7 for the exact `loader({ i18n })` API shape
- Skill: NONE

**Done when**:
- [ ] `loader()` call includes `i18n` from T1
- [ ] `source.getPageTree()` / `source.getPage()` call sites elsewhere still type-check (they'll be updated to accept `lang` in later tasks — this task only wires the config)
- [ ] Gate check passes: `pnpm lint && pnpm types:check`

**Tests**: none
**Gate**: quick

**Verify**: `pnpm types:check` exits 0. Downstream compile errors in page files are expected here and resolved by T3-T5 — confirm they are exactly the call sites this task's design anticipated (no surprise breakage elsewhere).

---

### T3: Move and adapt the home + docs page routes under `app/[lang]`

**What**: Move `app/(home)/page.tsx` + `app/(home)/layout.tsx` to `app/[lang]/(home)/` and `app/docs/layout.tsx` + `app/docs/[[...slug]]/page.tsx` to `app/[lang]/docs/`. Add `lang` to `generateStaticParams` (`source.generateParams('slug', 'locale')` per the confirmed Fumadocs i18n migration note), thread `lang` through to `source.getPage(slug, lang)` / `source.getPageTree(lang)`, and pass Fumadocs' `i18n` config into `DocsLayout`/`HomeLayout` so the built-in language switcher renders.
**Where**: `src/app/[lang]/(home)/page.tsx`, `src/app/[lang]/(home)/layout.tsx`, `src/app/[lang]/docs/layout.tsx`, `src/app/[lang]/docs/[[...slug]]/page.tsx` (new locations); delete old `src/app/(home)/`, `src/app/docs/` paths
**Depends on**: T2
**Reuses**: All existing page/layout content from `docs-site` — pure relocation + locale-param plumbing, no redesign
**Requirement**: i18n-01, i18n-02

**Tools**:
- MCP: Context7 for the exact `DocsLayout`/`HomeLayout` `i18n` prop and language-switcher wiring for the installed `fumadocs-ui` version
- Skill: NONE

**Done when**:
- [ ] `pnpm build` generates `/en/`, `/pt/`, `/es/` and `/en/docs/...`, `/pt/docs/...`, `/es/docs/...` for every existing page
- [ ] A visible language switcher renders on every page (home + docs)
- [ ] No old `/` or `/docs/...` (un-prefixed) routes remain in the build output
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: `pnpm build`; inspect `out/en/index.html`, `out/pt/index.html`, `out/es/index.html`, `out/en/docs/validation/array-builder/index.html` (and `pt`/`es` equivalents) all exist and render the (English-fallback, at this point) content.

---

### T4: Move and adapt the search route under `app/[lang]/api/search`

**What**: Move `src/app/api/search/route.ts` to `src/app/[lang]/api/search/route.ts`, confirming `createFromSource(source).staticGET` produces one distinct static index per locale segment.
**Where**: `src/app/[lang]/api/search/route.ts` (new location); delete old `src/app/api/search/route.ts`
**Depends on**: T3
**Reuses**: The exact `staticGET` pattern from `docs-site` (`.specs/features/docs-site/design.md`) — only the file location and locale-scoping change
**Requirement**: i18n-03

**Tools**:
- MCP: Context7 to confirm `createFromSource` naturally locale-scopes when the underlying `source` has `i18n` configured (vs. needing an explicit per-locale param)
- Skill: NONE

**Done when**:
- [ ] `pnpm build` produces 3 distinct static search index files, one per locale path (e.g. `out/en/api/search`, `out/pt/api/search`, `out/es/api/search`)
- [ ] The Portuguese index contains only Portuguese-or-fallback page entries scoped correctly (spot-check the JSON content, not just file existence)
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: `pnpm build`; `find out -path "*api/search*"` shows 3 files; inspect one JSON file's page-title list matches that locale's page set.

---

### T5: Move and adapt the OG-image and llms.\* routes under `app/[lang]`

**What**: Move `app/og/docs/[...slug]/route.tsx`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `app/llms.mdx/docs/[[...slug]]/route.ts` under `app/[lang]/...`, updating each `generateStaticParams` to include `lang` alongside the existing `slug` param (same migration pattern as T3).
**Where**: `src/app/[lang]/og/docs/[...slug]/route.tsx`, `src/app/[lang]/llms.txt/route.ts`, `src/app/[lang]/llms-full.txt/route.ts`, `src/app/[lang]/llms.mdx/docs/[[...slug]]/route.ts` (new locations); delete old un-prefixed paths
**Depends on**: T3
**Reuses**: Existing route logic from `docs-site` (`getPageImage`, `getLLMText`, `getPageMarkdownUrl`) — only param shape changes
**Requirement**: i18n-01

**Tools**:
- MCP: Context7 if the exact `generateStaticParams` migration shape is unclear for route handlers (vs. pages)
- Skill: NONE

**Done when**:
- [ ] `pnpm build` produces locale-scoped OG images and llms.\* output for all 3 locales with no build errors
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: `pnpm build`; spot-check `out/en/og/docs/.../image.png` and `out/pt/og/docs/.../image.png` both exist and differ only in the locale-appropriate title text if the source page happens to be translated (English fallback otherwise, which is correct per i18n-01).

---

### T6: Verify and finalize the language switcher round-trip

**What**: Confirm the Fumadocs-provided language switcher (wired in T3) correctly preserves the current page path when switching locale (not bouncing to that locale's homepage), across both translated and untranslated pages.
**Where**: No new files expected; only fix `src/app/[lang]/docs/[[...slug]]/page.tsx` / `src/lib/layout.shared.tsx` if the round-trip doesn't already work correctly out of the box
**Depends on**: T3, T4
**Reuses**: T3's switcher wiring
**Requirement**: i18n-02

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] From `/en/docs/emitter` (untranslated), switching to Portuguese lands on `/pt/docs/emitter` (English-fallback content), not `/pt/`
- [ ] From `/en/` (home), switching to Spanish lands on `/es/`
- [ ] Gate check passes: `pnpm build` (manual browser verification for the actual click-through, per `.specs/codebase/TESTING.md`'s "manual review" pattern for non-automated interaction checks)

**Tests**: none
**Gate**: full

**Verify**: Manual: run `pnpm dev` (or serve `out/` statically), click through the switcher from 3 different pages, confirm path preservation each time.

---

### T7: Root `/` redirect page

**What**: Create `src/app/page.tsx` (outside the `[lang]` segment) as a minimal static redirect: `<meta http-equiv="refresh" content="0; url=/en/">`-style behavior determined by `navigator.language` where feasible, or a plain immediate redirect to `/en/` if a static, JS-free `navigator.language` check turns out infeasible for a purely static page — plus an always-visible `<a href="/en/">Continue in English</a>` fallback link satisfying FR-i18n-04 AC2 regardless of which mechanism is used.
**Where**: `src/app/page.tsx` (new)
**Depends on**: T2
**Reuses**: N/A
**Requirement**: i18n-04

**Tools**:
- MCP: Context7 / WebSearch only if static-export-compatible `navigator.language` redirect patterns for Next.js App Router are unclear
- Skill: NONE

**Done when**:
- [ ] Visiting `/` with browser language `pt-BR` lands on `/pt/`
- [ ] Visiting `/` with browser language `es-MX` lands on `/es/`
- [ ] Visiting `/` with browser language `de-DE` (unsupported) lands on `/en/`
- [ ] With JavaScript disabled, `/` still shows a visible link to `/en/`
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Manual: test all 3 language scenarios via browser devtools language override, plus one JS-disabled check.

---

### T8: Full infra build gate

**What**: Run the complete build+lint gate across the restructured routes before starting translation work, confirming zero regressions against the pre-i18n site (all pages reachable, no 404s, footer/GitHub links still correct).
**Where**: N/A (verification task; fix-as-needed across `src/app/[lang]/**`)
**Depends on**: T6, T7
**Reuses**: N/A
**Requirement**: i18n-01, i18n-02, i18n-03, i18n-04

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm types:check` passes with zero errors
- [ ] `pnpm build` succeeds, producing `out/{en,pt,es}/...` for every page plus the root redirect
- [ ] Gate check passes: `pnpm lint && pnpm types:check && pnpm build`

**Tests**: none
**Gate**: full

**Verify**: All 3 commands exit 0 in sequence; manually click through at least 5 pages per locale in a static file server against `out/`.

---

### T9: Home page string dictionary (infra + English entry)

**What**: Create `src/lib/home-dictionary.ts` exporting `getHomeDictionary(lang)` returning the `HomeDictionary` shape from design.md, with the `en` entry populated from the existing hardcoded hero/footer copy (copied verbatim, not rewritten). Wire `app/[lang]/(home)/page.tsx` and `Footer` to consume it instead of hardcoded strings.
**Where**: `src/lib/home-dictionary.ts` (new), `src/app/[lang]/(home)/page.tsx` (modify), `src/components/footer.tsx` (modify)
**Depends on**: T8
**Reuses**: Existing English hero/footer copy from `docs-site` — copied into the `en` dictionary entry unchanged
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `/en/` renders byte-for-byte the same visible text as before this task (regression check against `docs-site`'s hero)
- [ ] `pt`/`es` entries exist in the dictionary with placeholder (English) text for now — filled in T10/T11
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Diff rendered `/en/` text content before/after this task — must be identical.

---

### T10: Translate home page dictionary — Portuguese

**What**: Fill the `pt` entry in `home-dictionary.ts` with Brazilian Portuguese translations of every string (hero title/subtitle/tagline, CTAs, capability card titles/descriptions, footer strings).
**Where**: `src/lib/home-dictionary.ts` (modify)
**Depends on**: T9
**Reuses**: N/A (translation content)
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `/pt/` shows fully Portuguese hero, capability cards, and footer — no residual English
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Visual review of `/pt/` — every string translated, layout unbroken by longer/shorter text.

---

### T11: Translate home page dictionary — Spanish

**What**: Fill the `es` entry in `home-dictionary.ts` with neutral/Latin American Spanish translations of every string.
**Where**: `src/lib/home-dictionary.ts` (modify)
**Depends on**: T9
**Reuses**: N/A (translation content)
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `/es/` shows fully Spanish hero, capability cards, and footer — no residual English
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Visual review of `/es/` — every string translated, layout unbroken.

---

### T12: Translate Getting Started — Introduction (`index.mdx`) [P]

**What**: Create `content/docs/getting-started/index.pt.mdx` and `index.es.mdx` — full translation of the Introduction page (philosophy, v1 scope, Callout, Cards), Go identifiers/code untranslated.
**Where**: `content/docs/getting-started/index.pt.mdx`, `content/docs/getting-started/index.es.mdx` (new)
**Depends on**: T8
**Reuses**: `content/docs/getting-started/index.mdx` (English source) as the structural template
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Both files exist with translated prose, identical MDX structure (same Callout/Cards) to the English source
- [ ] `/pt/docs/getting-started` and `/es/docs/getting-started` render the translated content
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: `pnpm build`; visually diff rendered pt/es pages against the English source — same structure, translated prose.

---

### T13: Translate Getting Started — Installation [P]

**What**: Create `content/docs/getting-started/installation.pt.mdx` and `.es.mdx`.
**Where**: `content/docs/getting-started/installation.pt.mdx`, `installation.es.mdx` (new)
**Depends on**: T8
**Reuses**: `installation.mdx` (English source)
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Both files exist, fully translated, `go get` command and version-caveat Callout preserved verbatim (code/commands untranslated)
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Visual diff against English source.

---

### T14: Translate Getting Started — Quickstart [P]

**What**: Create `content/docs/getting-started/quickstart.pt.mdx` and `.es.mdx`.
**Where**: `content/docs/getting-started/quickstart.pt.mdx`, `quickstart.es.mdx` (new)
**Depends on**: T8
**Reuses**: `quickstart.mdx` (English source)
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Both files exist, `Steps`/`Tabs` structure and all Go code blocks preserved verbatim, only prose translated
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Visual diff against English source; confirm code blocks are byte-identical to the English version (translation must never touch code).

---

### T15: Translate Getting Started — Bootstrap [P]

**What**: Create `content/docs/getting-started/bootstrap.pt.mdx` and `.es.mdx`.
**Where**: `content/docs/getting-started/bootstrap.pt.mdx`, `bootstrap.es.mdx` (new)
**Depends on**: T8
**Reuses**: `bootstrap.mdx` (English source)
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Both files exist, `Steps` structure and `AppOptions` field list preserved verbatim, only prose translated
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Visual diff against English source.

---

### T16: Translate Getting Started — Examples [P]

**What**: Create `content/docs/getting-started/examples.pt.mdx` and `.es.mdx`.
**Where**: `content/docs/getting-started/examples.pt.mdx`, `examples.es.mdx` (new)
**Depends on**: T8
**Reuses**: `examples.mdx` (English source)
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Both files exist, `Cards` links preserved verbatim (they point to GitHub, not localized paths), only descriptions translated
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: Visual diff against English source.

---

### T17: Getting Started translation cross-check

**What**: Verify all 5 translated pages (×2 locales = 10 files) render correctly under both `/pt/docs/...` and `/es/docs/...`, with correct fallback still working for every other (untranslated) section.
**Where**: N/A (verification task)
**Depends on**: T12, T13, T14, T15, T16
**Reuses**: N/A
**Requirement**: i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All 10 translated pages render correctly in their locale
- [ ] `/pt/docs/emitter` and `/es/docs/emitter` (untranslated, control check) still render English fallback correctly
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: full

**Verify**: `pnpm build`; spot-check the 10 translated pages plus 2 untranslated control pages per locale.

---

### T18: Full i18n success-criteria pass

**What**: Walk `spec.md`'s Success Criteria checklist top to bottom; confirm every item or explicitly defer with a reason recorded in `.specs/project/STATE.md`.
**Where**: N/A (review + STATE.md update)
**Depends on**: T11, T17
**Reuses**: `spec.md` Success Criteria section
**Requirement**: i18n-01, i18n-02, i18n-03, i18n-04, i18n-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Every Success Criteria item in `spec.md` is checked off or explicitly deferred with reason
- [ ] `.specs/project/STATE.md` updated noting the ~38 remaining untranslated pages as a tracked follow-up (not a blocker)

**Tests**: none
**Gate**: full

**Verify**: Read `spec.md` Success Criteria top to bottom, confirm each line has a checked box or documented deferral.

---

### T19: Update ROADMAP.md with i18n milestone and remaining translation follow-up

**What**: Add an i18n milestone to `.specs/project/ROADMAP.md` reflecting what shipped (infra + Home/Getting Started translations) and list the remaining ~38 pages × 2 locales as a `Future Considerations` / next-milestone entry.
**Where**: `.specs/project/ROADMAP.md` (modify)
**Depends on**: T18
**Reuses**: Existing ROADMAP.md structure
**Requirement**: N/A (project bookkeeping)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] ROADMAP.md reflects the i18n milestone as complete for its v1 scope, with remaining translation work listed explicitly

**Tests**: none
**Gate**: none (documentation-only)

**Verify**: Read the updated ROADMAP.md section.

---

## Parallel Execution Map

```
Phase 1 (Sequential):   T1 -> T2
Phase 2 (Sequential):   T2 -> T3 -> T4 -> T5 -> T6
Phase 3 (Parallel to Phase 2, same dependency): T2 -> T7
Phase 4 (Sequential):   {T6, T7} -> T8
Phase 5 (Sequential):   T8 -> T9 -> T10 -> T11
Phase 6 (Parallel):     T8 -> { T12, T13, T14, T15, T16 } -> T17
Phase 7 (Sequential):   {T11, T17} -> T18 -> T19
```

**Parallelism constraint reminder:** T12-T16 each create independent new
`.pt.mdx`/`.es.mdx` file pairs with no shared mutable state — parallel-safe
per `.specs/codebase/TESTING.md`'s existing assessment for content-authoring
tasks.

---

## Task Granularity Check

| Task | Scope | Status |
|---|---|---|
| T1, T2 | 1 config file / 1 modified call each | ✅ Granular |
| T3 | Route relocation + param threading for home+docs (2 route trees, cohesive single mechanical change) | ✅ Granular (moving/adapting one coherent routing concern) |
| T4, T5 | 1 route relocation each | ✅ Granular |
| T6, T7, T8 | 1 verification/1 new page/1 full gate each | ✅ Granular |
| T9 | 1 new file + 2 call-site wirings, all part of the same "introduce the dictionary" change | ✅ Granular |
| T10, T11 | 1 locale's worth of translation each | ✅ Granular |
| T12-T16 | 1 page × 2 locale files each | ✅ Granular |
| T17, T18, T19 | 1 verification/1 review/1 doc update each | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
|---|---|---|---|
| T1 | None | None | ✅ Match |
| T2 | T1 | T1→T2 | ✅ Match |
| T3 | T2 | T2→T3 | ✅ Match |
| T4 | T3 | T3→T4 | ✅ Match |
| T5 | T3 | T3→T5 (via T4 sequential chain in Phase 2) | ✅ Match |
| T6 | T3, T4 | T4→T6 (sequential chain covers T3 transitively) | ✅ Match |
| T7 | T2 | T2→T7 (Phase 3, parallel to Phase 2) | ✅ Match |
| T8 | T6, T7 | {T6,T7}→T8 | ✅ Match |
| T9 | T8 | T8→T9 | ✅ Match |
| T10 | T9 | T9→T10 | ✅ Match |
| T11 | T9 | T9→T11 | ✅ Match |
| T12-T16 | T8 (each) | T8→{T12..T16} | ✅ Match |
| T17 | T12,T13,T14,T15,T16 | {T12-T16}→T17 | ✅ Match |
| T18 | T11, T17 | {T11,T17}→T18 | ✅ Match |
| T19 | T18 | T18→T19 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires (`.specs/codebase/TESTING.md`) | Task Says | Status |
|---|---|---|---|---|
| T1, T2 | Config/loader wiring | build + lint | quick (lint+typecheck) | ✅ OK |
| T3-T5 | Fumadocs config / route restructure | build + lint | full (build) | ✅ OK |
| T6, T7 | Interactive UI (switcher, redirect) — no Playwright installed yet in this repo | e2e ideally, falls back to manual per TESTING.md when no harness exists | full (build) + manual verification called out explicitly | ✅ OK (documented manual gate, not silently skipped) |
| T8 | Full-site gate | build + lint | full | ✅ OK |
| T9-T11 | Home page content (dictionary) | none (manual review) | full (build, for regression safety) | ✅ OK |
| T12-T16 | MDX content pages | none (manual review) | full (build) | ✅ OK |
| T17-T19 | Verification / docs-only | none | full / none | ✅ OK |

All tasks pass both cross-checks. No restructuring needed.

---

## MCPs and Skills Confirmation Needed

Before Execute begins, confirm:

- **Context7 MCP**: continue using for exact Fumadocs i18n API shapes (`defineI18n`, `loader({i18n})`, `DocsLayout`/`RootProvider` switcher prop, `generateStaticParams('slug','locale')`) since T1-T5 depend on getting these exactly right against the installed version, not assumed from memory.
- **No Playwright in this repo yet**: T6/T7's verification is manual browser testing, not automated e2e — consistent with `docs-site`'s TESTING.md, which deferred Playwright setup to that feature's own T45/T48/T52 (not yet executed). If Playwright gets installed before this feature executes, T6/T7 should upgrade to real e2e tests instead of manual verification.
