# gonest Documentation Site Specification

## Problem Statement

gonest is a complete, NestJS-inspired Go framework (all v1 milestones + Milestone 12 shipped) but has no navigable documentation — only a 571-line README and internal `.specs` design docs. JS/TS developers evaluating a Go migration need a fast, familiar, example-driven onboarding experience comparable to better-auth, Hono, and Drizzle's docs sites, or gonest loses them at the "where do I start" step.

## Goals

- [ ] Every shipped gonest capability has an accurate, navigable doc page with correct (README-current, not spec-era) API names and runnable-looking code examples.
- [ ] Visual/UX polish matches the reference sites: simple hero, minimal sidebar, instant search, dark theme, custom MDX components.
- [ ] At least one genuinely interactive, in-browser example exists (WASM playground) plus one live-API "Try it" example — not just static code blocks.

## Out of Scope

| Feature                                              | Reason                                                                                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Versioned docs (v1/v2 switcher)                      | gonest has no tagged release; only one version exists                                                                                          |
| i18n                                                 | No requirement surfaced; single-language English (matching README) for v1                                                                      |
| Full arbitrary Go code execution (run any user code) | Requires a hosted sandbox/execution service (go-judge/piston-class infra) — out of budget for v1; WASM covers logic-only interactivity instead |
| Blog/community/contribution pages                    | No community infra exists yet in gonest project                                                                                                |
| Authenticated/private docs sections                  | Not requested; docs are public                                                                                                                 |

---

## User Stories

### P1: Land and understand gonest in under 2 minutes ⭐ MVP

**User Story**: As a JS/TS developer evaluating gonest, I want a hero landing page with a one-line pitch and a copy-pasteable quickstart, so that I can decide in under 2 minutes whether this fits my mental model.

**Why P1**: This is the site's entire acquisition funnel — if the hero/quickstart doesn't land, nothing else matters.

**Acceptance Criteria**:

1. WHEN a visitor lands on `/` THEN the system SHALL show a hero section with project name, one-sentence pitch, and two CTAs (Get Started, GitHub).
2. WHEN a visitor views the hero THEN the system SHALL show the exact quickstart code block from gonest's README (Module/Provider/Controller/App bootstrap), syntax-highlighted, with a copy button.
3. WHEN a visitor scrolls past the hero THEN the system SHALL show a feature-grid (Cards component) summarizing the ~10 major capability areas (DI, Pipeline, Validation, OpenAPI, Emitter, Scheduler, Terminus, Testing, Multipart, Type-safe builders).

**Independent Test**: Load `/` in a browser, confirm hero renders, quickstart copy button works, feature cards link to correct doc sections.

---

### P1: Navigate and search all documented capabilities ⭐ MVP

**User Story**: As a developer reading gonest docs, I want a minimal sidebar organized by capability area and instant full-text search, so that I can find any API or concept in seconds without knowing the exact page name.

**Why P1**: Navigation + search is the core utility of a docs site; without it, content is just a wall of pages.

**Acceptance Criteria**:

1. WHEN a user opens any docs page THEN the system SHALL show a persistent left sidebar grouped into sections: Getting Started, Core Concepts, Request Pipeline, Validation & Schemas, Multipart, OpenAPI/Swagger, Event Emitter, Scheduler, Health Checks, Testing, API Reference.
2. WHEN a user presses the search shortcut (Cmd/Ctrl+K) or clicks the search box THEN the system SHALL open an instant fuzzy-search modal indexing all page titles/headings/content.
3. WHEN a user types a query (e.g. "MustInject", "guard", "schema") THEN the system SHALL return ranked matching pages/sections within ~100ms perceived latency (client-side index).
4. WHEN a user is on a docs page THEN the system SHALL show an on-page table-of-contents (right rail) linking to that page's headings.

**Independent Test**: Open any doc page, hit Cmd+K, search "guard", confirm the Guard page appears in results and clicking navigates correctly.

---

### P1: Read accurate, complete API documentation for every gonest capability ⭐ MVP

**User Story**: As a developer implementing a feature with gonest, I want each capability (Modules, Pipeline stages, Schema builders, OpenAPI, Emitter, Scheduler, Terminus, Testing) documented with correct current API names, signatures, and working code samples, so that I can copy-paste and adapt without hunting through source or `.specs`.

**Why P1**: This is the actual reference value of the site — hero/nav/search are worthless without correct content underneath.

**Acceptance Criteria**:

1. WHEN documenting any API THEN the system SHALL use current README-accurate names only (`NewSchema`/`*Schema`, `MustParseRestJsonBody`/`MustParseRestParams`/`MustParseRestQuery`/`MustParseRestFormBody`, `RestContext`) and SHALL NOT use retired spec-era names (`NewMetadata`, `MustJsonBody`, `MustParam`, `Pipe`/`NewPipe`).
2. WHEN a page documents a builder pattern (Module/Provider/Controller/Route/Schema/Middleware/Guard/Interceptor/Filter) THEN the system SHALL show the builder-function signature, every chainable method with a one-line description, and at least one complete runnable-looking example.
3. WHEN a page documents execution-order-sensitive behavior (Pipeline stages) THEN the system SHALL include a diagram or ordered list showing: global Middleware → controller Middleware → Guard → Interceptor(before) → Handler → Interceptor(after), with Filter wrapping the whole chain.
4. WHEN a page documents the Array Builder THEN the system SHALL clearly distinguish container-field configuration (`Required`/`Nullable`/`Description`/`Examples` before or without `Items`) from item configuration (inside the `Items(func(m *ArrayMetadata){...})` callback) and from post-`Items` count bounds (`.Min(n)`/`.Max(n)` chained after `Items(fn)`).
5. WHEN a page documents Multipart Form Streaming THEN the system SHALL state the streaming trade-off explicitly (files may have already been processed via `onFile` before a later field fails validation).

**Independent Test**: Cross-check 5 random doc pages against `README.md` — every symbol name, method signature, and example must match the README's current API exactly.

---

### P2: Interact with gonest's schema/validation logic live in the browser

**User Story**: As a developer curious how gonest's validation behaves, I want an in-browser playground where I can edit a schema/JSON input and see live validation output, so that I understand the behavior without setting up a local Go project.

**Why P2**: High-value differentiator (matches the "interactive examples" ask) but not required to ship a useful v1 reference site — can follow M1-M3 content.

**Acceptance Criteria**:

1. WHEN a user opens a Validation/Schema doc page with an embedded playground THEN the system SHALL show an editable code/JSON panel and an output panel.
2. WHEN a user edits the input and triggers "Run" THEN the system SHALL execute gonest's actual schema/validation logic client-side (compiled to WASM) and display real validation results (pass, or field-level violations) with no network round-trip.
3. WHEN the WASM module fails to load (unsupported browser, slow network) THEN the system SHALL show a graceful fallback message and the static code example remains visible/readable.

**Independent Test**: Load a playground-enabled page, edit an input to violate a `Required`/`Min`/`Max` constraint, click Run, confirm the violation appears in the output panel with correct field name/message.

---

### P2: Try real HTTP endpoints against a live gonest demo API

**User Story**: As a developer evaluating gonest's request pipeline (Guards, Interceptors, DI-wired controllers), I want a "Try it" panel that sends real HTTP requests to a hosted gonest demo app and shows the real response, so that I can see the framework behave end-to-end, not just read about it.

**Why P2**: Demonstrates pipeline/DI behavior that a pure-logic WASM playground cannot (real HTTP, real middleware chain) — valuable but not blocking for shipping the reference content.

**Acceptance Criteria**:

1. WHEN a user opens a Pipeline/OpenAPI doc page with an embedded "Try it" panel THEN the system SHALL show the HTTP method, path, and an editable request body/params matching that endpoint's schema.
2. WHEN a user clicks "Send" THEN the system SHALL make a real request to the hosted demo API (deployed from gonest's `.examples/blog-api`) and display status code, headers, and JSON body of the real response.
3. WHEN the hosted demo API is unreachable THEN the system SHALL show a clear error state without breaking the rest of the page.

**Independent Test**: Open a Try-it-enabled page, send a request against a known endpoint (e.g. a guarded route without auth header), confirm a real 403 response renders.

---

### P3: Dark-theme-first, visually polished reading experience

**User Story**: As a developer reading docs at night or by preference, I want a deliberately polished dark theme (not just inverted colors) matching the visual bar of better-auth/Hono/Drizzle docs, so that reading long API references is comfortable.

**Why P3**: Important for perceived quality/credibility but doesn't block core documentation utility.

**Acceptance Criteria**:

1. WHEN a user has no stored theme preference THEN the system SHALL default to dark theme.
2. WHEN a user toggles theme THEN the system SHALL persist the choice and apply it without flash-of-unstyled-content on reload.
3. WHEN viewing code blocks THEN the system SHALL show well-contrasted syntax highlighting distinct from body text, with a copy button on hover.

**Independent Test**: Load site fresh (no cookies), confirm dark theme; toggle to light, reload, confirm light persists; inspect a code block for copy button and highlighting contrast.

---

## Edge Cases

- WHEN a doc page references a symbol renamed since the `.specs` era THEN content SHALL use only the current name and MAY include a one-line migration note if historically relevant (optional, not required).
- WHEN the WASM bundle exceeds a reasonable size/load time THEN the playground SHALL lazy-load only on pages that embed it (not on every page load).
- WHEN search index content changes (new pages added) THEN the system SHALL rebuild the search index at build time (static generation), not runtime.
- WHEN a code example spans multiple files (e.g. schema + controller + module) THEN the system SHALL use Tabs to separate files rather than one giant code block.
- WHEN the hosted demo API needs to reset state (e.g. todo/blog data mutated by visitors) THEN the system SHALL periodically reset or scope state per-session so the demo doesn't degrade.

---

## Requirement Traceability

| Requirement ID | Story                                | Phase  | Status  |
| -------------- | ------------------------------------ | ------ | ------- |
| DOCS-01        | P1: Land and understand in 2 minutes | Design | Pending |
| DOCS-02        | P1: Navigate and search              | Design | Pending |
| DOCS-03        | P1: Accurate API documentation       | Design | Pending |
| DOCS-04        | P2: WASM playground                  | Design | Pending |
| DOCS-05        | P2: Live demo API "Try it"           | Design | Pending |
| DOCS-06        | P3: Dark theme polish                | Design | Pending |

**Coverage:** 6 total, 6 mapped to design, 0 unmapped

---

## Success Criteria

- [ ] All 10 capability sections documented with README-accurate API names and examples (validated against README.md line-by-line).
- [ ] Search returns correct top-3 result for at least 20 spot-check queries covering major symbols (`MustInject`, `NewSchema`, `Guard`, `Interceptor`, `Filter`, `Emitter`, `Scheduler`, `MustParseRestJsonBody`, `SetupSwagger`, `MustNewTestApp`).
- [ ] Lighthouse/perf: docs pages are statically generated, first content paint fast (no client-side content fetch waterfall for text content).
- [ ] WASM playground produces correct validation output for at least 3 distinct scenarios (required-field violation, nested array item violation, custom `Custom(fn)` transform).
- [ ] Live demo "Try it" panel returns real responses for at least 3 endpoints spanning a public route, a guarded route, and a validated route.
