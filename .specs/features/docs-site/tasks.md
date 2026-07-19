# gonest Documentation Site Tasks

**Design**: `.specs/features/docs-site/design.md`
**Status**: In Progress — T1-T42 done (Phases 1-7: scaffold, theme, MDX components, hero, all 9 content sections, API reference). Remaining: T43-T53 (WASM playground, hosted demo API, polish/launch) — deferred pending hosting-platform decision.

---

## Execution Plan

### Phase 1: Foundation (Sequential)

```
T1 → T2 → T3 → T4 → T5
```

### Phase 2: Theme, Nav Shell, MDX Components (Parallel OK after Phase 1)

```
        ┌→ T6 ─┐
T5 ─────┼→ T7 ─┼→ T10
        └→ T8 ─┘
        T9 ──────→
```

### Phase 3: Hero + Getting Started + Core Concepts Content (Parallel OK after Phase 2)

```
         ┌→ T11 ─┐
         ├→ T12 ─┤
T10 ─────┼→ T13 ─┼→ T17
         ├→ T14 ─┤
         ├→ T15 ─┤
         └→ T16 ─┘
```

### Phase 4: Request Pipeline Content (Parallel OK after Phase 3)

```
         ┌→ T18 ─┐
         ├→ T19 ─┤
T17 ─────┼→ T20 ─┼→ T23
         ├→ T21 ─┤
         └→ T22 ─┘
```

### Phase 5: Validation & Schema Content (Parallel OK after Phase 4)

```
         ┌→ T24 ─┐
         ├→ T25 ─┤
         ├→ T26 ─┤
T23 ─────┼→ T27 ─┼→ T32
         ├→ T28 ─┤
         ├→ T29 ─┤
         ├→ T30 ─┤
         └→ T31 ─┘
```

### Phase 6: Multipart, OpenAPI, Emitter, Scheduler, Terminus, Testing Content (Parallel OK after Phase 5)

```
         ┌→ T33 ─┐
         ├→ T34 ─┤
         ├→ T35 ─┤
T32 ─────┼→ T36 ─┼→ T40
         ├→ T37 ─┤
         ├→ T38 ─┤
         └→ T39 ─┘
```

### Phase 7: API Reference Section (Parallel OK after Phase 6)

```
T40 → T41 (index) → T42 [P] (generate reference pages, batched)
```

### Phase 8: Interactivity — WASM Playground (Sequential, depends on validation content existing)

```
T31 → T43 → T44 → T45 → T46
```

### Phase 9: Interactivity — Live Demo API (Sequential, depends on pipeline content existing)

```
T22 → T47 → T48 → T49 → T50
```

### Phase 10: Polish & Launch Gate (Sequential, after all content + both interactive systems)

```
T42, T46, T50 → T51 → T52 → T53
```

---

## Task Breakdown

### T1: Scaffold Next.js + Fumadocs project

**What**: Run Fumadocs scaffold (`npm create fumadocs-app` or manual `fumadocs-ui`/`fumadocs-core`/`fumadocs-mdx` install) into this repo root, producing a building Next.js App Router project.
**Where**: repo root (`package.json`, `next.config.mjs`, `app/`, `content/docs/`, `source.config.ts`)
**Depends on**: None
**Reuses**: N/A (first scaffold)
**Requirement**: DOCS-01, DOCS-02

**Tools**:
- MCP: Context7 (`/llmstxt/fumadocs_dev_llms_txt`) for exact current scaffold commands
- Skill: NONE

**Done when**:
- [ ] `npm run dev` serves a default Fumadocs site locally
- [ ] `npm run build` succeeds
- [ ] Gate check passes: `npm run build`
- [ ] Test count: N/A (scaffold task)

**Tests**: none
**Gate**: full

**Verify**: `npm run build` exits 0; `npm run dev` then load `http://localhost:3000` shows default Fumadocs page.

---

### T2: Configure content source (`content/docs` structure)

**What**: Set up `source.config.ts` / `lib/source.ts` pointing at `content/docs`, matching the 11-section IA from design.md.
**Where**: `source.config.ts`, `lib/source.ts`, `content/docs/meta.json` files per section
**Depends on**: T1
**Reuses**: Fumadocs default source loader

**Tools**:
- MCP: Context7 for `fumadocs-mdx` config API
- Skill: NONE

**Done when**:
- [ ] All 11 sections (Getting Started, Core Concepts, Request Pipeline, Validation & Schemas, Multipart, OpenAPI/Swagger, Emitter, Scheduler, Health Checks, Testing, API Reference) exist as folders with `meta.json` ordering
- [ ] Placeholder `index.mdx` in each section builds without error
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Sidebar (once layout exists in T6) shows all 11 sections in the correct order.

---

### T3: Configure `mdx-components.tsx` with Fumadocs defaults

**What**: Create root MDX component map merging `fumadocs-ui/mdx` defaults (includes Callout, Cards, Code Block, Headings).
**Where**: `mdx-components.tsx`
**Depends on**: T1
**Reuses**: `fumadocs-ui/mdx` `defaultComponents`

**Tools**:
- MCP: Context7 for exact `getMDXComponents` pattern
- Skill: NONE

**Done when**:
- [ ] `getMDXComponents()` exported, spreading `defaultComponents`
- [ ] Gate check passes: `npm run typecheck`

**Tests**: none
**Gate**: quick

**Verify**: A test MDX page using `<Callout type="info">test</Callout>` and `<Cards><Card title="x"/></Cards>` renders styled output.

---

### T4: Register Tabs component in MDX map

**What**: Import and register `Tab`/`Tabs` from `fumadocs-ui/components/tabs` into the component map from T3.
**Where**: `mdx-components.tsx` (modify)
**Depends on**: T3
**Reuses**: `fumadocs-ui/components/tabs`

**Tools**:
- MCP: Context7
- Skill: NONE

**Done when**:
- [ ] `Tab`/`Tabs` registered
- [ ] Gate check passes: `npm run typecheck`

**Tests**: none
**Gate**: quick

**Verify**: Test MDX page with `<Tabs><Tab value="a" label="A">x</Tab></Tabs>` renders a working tab switcher.

---

### T5: Build/verify Steps component

**What**: Confirm whether Fumadocs ships a `Steps`/`Step` component; if yes, register it in the MDX map like T3/T4; if no, build a small custom `Steps` component (numbered list with connecting line, matching the visual style of Cards/Callout) and register it.
**Where**: `mdx-components.tsx` (modify) + `components/steps.tsx` (only if custom build needed)
**Depends on**: T4
**Reuses**: Fumadocs native component if it exists; else Fumadocs' Callout/Card styling conventions as a visual reference

**Tools**:
- MCP: Context7 (check Fumadocs UI components list first)
- Skill: NONE

**Done when**:
- [ ] `Steps`/`Step` usable in MDX
- [ ] Gate check passes: `npm run typecheck`

**Tests**: none
**Gate**: quick

**Verify**: Test MDX page with a 3-step `<Steps>` block renders numbered, visually connected steps.

---

### T6: Dark-first theme CSS variables [P]

**What**: Define `--color-fd-*` CSS custom properties in `app/global.css` for a polished dark theme (background, foreground, card, popover, border, accent) matching the better-auth/Hono/Drizzle visual bar; set dark as the default via Fumadocs' theme provider config.
**Where**: `app/global.css`, `app/layout.tsx` (`RootProvider` theme config)
**Depends on**: T5
**Reuses**: Fumadocs theme CSS variable API

**Tools**:
- MCP: Context7 for `--color-fd-*` variable list
- Skill: NONE

**Done when**:
- [ ] Fresh load (no stored preference) shows dark theme
- [ ] Theme toggle switches to a legible light theme and persists across reload
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Clear cookies/localStorage, load site → dark. Toggle theme, reload → light persists.

---

### T7: Sidebar navigation shell [P]

**What**: Wire `DocsLayout` sidebar using the 11-section tree from T2, minimal style (no heavy nested collapsing beyond 2 levels).
**Where**: `app/docs/layout.tsx`
**Depends on**: T5
**Reuses**: Fumadocs `DocsLayout` defaults

**Tools**:
- MCP: Context7
- Skill: NONE

**Done when**:
- [ ] Sidebar shows all 11 sections with correct nesting
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Navigate `/docs`, confirm sidebar order matches design.md IA exactly.

---

### T8: Right-rail table of contents [P]

**What**: Enable Fumadocs' on-page TOC component for docs pages.
**Where**: `app/docs/[[...slug]]/page.tsx`
**Depends on**: T5
**Reuses**: Fumadocs `DocsPage` TOC prop

**Tools**:
- MCP: Context7
- Skill: NONE

**Done when**:
- [ ] Any doc page with 2+ headings shows a right-rail TOC linking to those headings
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Open a page with multiple `##` headings, confirm TOC links scroll correctly.

---

### T9: Instant search wiring [P]

**What**: Wire Fumadocs built-in search (Orama-based) with static index generation; enable Cmd/Ctrl+K trigger.
**Where**: `app/api/search/route.ts` (or static export config per Fumadocs search docs), `app/layout.tsx` (search trigger)
**Depends on**: T5
**Reuses**: `fumadocs-core/search`

**Tools**:
- MCP: Context7 for current static search index setup
- Skill: NONE

**Done when**:
- [ ] Cmd/Ctrl+K opens search modal
- [ ] Typing a known page title returns it in results
- [ ] Gate check passes: `npm run build`

**Tests**: e2e
**Gate**: e2e

**Verify**: Playwright test: press Cmd/Ctrl+K, type a seeded placeholder page title, assert result appears and navigates on click.

---

### T10: Hero landing page shell

**What**: Build `app/(home)/page.tsx` hero section (project name, one-line pitch, two CTAs) — content placeholder, structure only (real copy comes in T11).
**Where**: `app/(home)/page.tsx`
**Depends on**: T6, T7, T8, T9
**Reuses**: Fumadocs UI primitives (buttons, layout containers)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Hero renders with placeholder pitch + 2 CTA buttons (Get Started → `/docs`, GitHub → external link placeholder)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Load `/`, confirm hero layout and both CTA links resolve.

---

### T11: Hero final copy + quickstart code block [P]

**What**: Replace placeholder hero copy with final pitch (derived from PROJECT.md vision) and embed the exact README quickstart code block (Module/Provider/Controller/App bootstrap) with syntax highlighting + copy button.
**Where**: `app/(home)/page.tsx` (modify)
**Depends on**: T10
**Reuses**: README.md quickstart snippet (verbatim), Fumadocs default code block (Shiki-based, has copy button built in)

**Tools**:
- MCP: NONE (source is local README, already extracted in content map)
- Skill: NONE

**Done when**:
- [ ] Quickstart code block matches README's quickstart exactly (symbol names, structure)
- [ ] Copy button works
- [ ] Manual cross-check: diffed against `C:\dev\gonest-dev\gonest\README.md` quickstart section
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Manually diff the rendered snippet against README.md quickstart; click copy button, paste, confirm exact match.

---

### T12: Feature-grid Cards on hero [P]

**What**: Add a `Cards`/`Card` grid below the hero summarizing the ~10 capability areas, each linking to its docs section.
**Where**: `app/(home)/page.tsx` (modify)
**Depends on**: T10
**Reuses**: `fumadocs-ui/components/card`

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] 10 cards present (DI, Pipeline, Validation, OpenAPI, Emitter, Scheduler, Terminus, Testing, Multipart, Type-safe builders)
- [ ] Each card links to the correct section index page
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Click each card, confirm it lands on the matching section's index page (placeholder OK if section content not yet written).

---

### T13: Getting Started — Introduction & Installation page [P]

**What**: Write `content/docs/getting-started/index.mdx` (Introduction: what gonest is, philosophy) and `installation.mdx` (module path, no-stable-version caveat, Go 1.18+ requirement).
**Where**: `content/docs/getting-started/index.mdx`, `content/docs/getting-started/installation.mdx`
**Depends on**: T10
**Reuses**: Content map Overview section, PROJECT.md constraints (no LICENSE/tag yet)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Introduction accurately states NestJS-inspired DI/HTTP framework positioning, current-README terminology only
- [ ] Installation states `go get github.com/gonest-dev/gonest` with a Callout noting no stable version tag yet
- [ ] Manual cross-check against README.md intro section
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Read rendered page, confirm no spec-era naming (`NewMetadata`, `MustJsonBody`, etc.) appears anywhere.

---

### T14: Getting Started — Quickstart & Project Structure page [P]

**What**: Write `quickstart.mdx` (full runnable Module/Provider/Controller/App example, using Steps component to walk through: define provider → define controller → define module → bootstrap app) and `bootstrap.mdx` (3-phase bootstrap explanation: Provider resolution → Controller declaration → Pipeline-stage declaration).
**Where**: `content/docs/getting-started/quickstart.mdx`, `content/docs/getting-started/bootstrap.mdx`
**Depends on**: T10
**Reuses**: Content map quickstart code, `Steps` component (T5)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Quickstart code matches README exactly
- [ ] Steps component used for the walkthrough
- [ ] 3-phase bootstrap correctly explained (errgroup-parallel provider resolution mentioned)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against README + content map bootstrap description.

---

### T15: Core Concepts — Modules & Providers page [P]

**What**: Write `content/docs/core-concepts/modules.mdx` and `providers.mdx` documenting `NewModule`/`Providers`/`Controllers`/`Imports`/`Exports`/`Use`/`Filters`/`Listeners`/`Schedulers`/`Name`, and `NewProvider`/`Scope`/`Constructor` with the 3 scopes (`ScopeSingleton`/`ScopeTransient`/`ScopeRequest`) and the "no dependency parameter in Constructor" rule.
**Where**: `content/docs/core-concepts/modules.mdx`, `content/docs/core-concepts/providers.mdx`
**Depends on**: T10
**Reuses**: Content map Core Concepts section

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Every `Module`/`Provider` method from content map documented with signature + 1-line description
- [ ] Constructor's 4 allowed signatures (`func()`, `func()(T,error)`, `func(ctx)T`, `func(ctx)(T,error)`) explicitly listed
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check every method name against content map; confirm no method is invented.

---

### T16: Core Concepts — Controllers, Routes & Dependency Injection page [P]

**What**: Write `content/docs/core-concepts/controllers.mdx` (Controller/Route builders, per-verb shorthands), `dependency-injection.mdx` (`MustInject`/`MustInjectAll`, pointer vs. interface matching, multi-binding example with `Connectable`/`Pingable`-style pattern).
**Where**: `content/docs/core-concepts/controllers.mdx`, `content/docs/core-concepts/dependency-injection.mdx`
**Depends on**: T10
**Reuses**: Content map DI graph section, multi-binding code example

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All per-verb route shorthands listed (`RouteGet`/`RoutePost`/.../`RouteConnect`)
- [ ] `MustInject`/`MustInjectAll` resolution rules (pointer exact match vs. interface `Implements()` fallback) explained accurately
- [ ] Multi-binding example included and matches content map
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against content map DI section verbatim code.

---

### T17: Core Concepts section index + cross-links

**What**: Write `content/docs/core-concepts/index.mdx` (section overview) and add "Next steps" cross-links at the bottom of T13-T16 pages pointing forward to Request Pipeline section.
**Where**: `content/docs/core-concepts/index.mdx`, minor edits to T13-T16 files
**Depends on**: T13, T14, T15, T16
**Reuses**: N/A

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Section index links to all 4 sub-pages in correct reading order
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Click through index → each sub-page → confirm forward links land on the next logical page.

---

### T18: Request Pipeline — Overview & Execution Order page [P]

**What**: Write `content/docs/request-pipeline/index.mdx` with the execution-order diagram (global Middleware → controller Middleware → Guard → Interceptor(before) → Handler → Interceptor(after), Filter wrapping all) using mermaid (check mermaid-studio skill availability first per SKILL.md integration).
**Where**: `content/docs/request-pipeline/index.mdx`
**Depends on**: T17
**Reuses**: Content map Pipeline Ordering description; mermaid-studio skill if installed

**Tools**:
- MCP: NONE
- Skill: mermaid-studio (if available, else inline mermaid)

**Done when**:
- [ ] Diagram accurately shows the proven execution order including Filter wrapping the entire chain
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Diagram renders; order matches content map exactly (Filter wraps everything, catches panics from anywhere inside).

---

### T19: Request Pipeline — Middleware page [P]

**What**: Write `middleware.mdx` documenting `NewMiddleware`/`Handler(func(ctx, next))`, `next(ctx)` semantics, `Controller.Use`/`Module.Use` (global vs. per-controller ordering).
**Where**: `content/docs/request-pipeline/middleware.mdx`
**Depends on**: T17
**Reuses**: Content map Middleware code example

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Example code matches content map (`RequestIdMiddleware`)
- [ ] Global vs. controller-level ordering explicitly stated
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against content map.

---

### T20: Request Pipeline — Guards page [P]

**What**: Write `guards.mdx` documenting `NewGuard`/`Handler(func(ctx) bool)`, false→403 behavior, panic-with-Exception override, multiple-guards short-circuit, controller-scoped-only limitation (no `Module.Guards`, no `MustInject` inside builder).
**Where**: `content/docs/request-pipeline/guards.mdx`
**Depends on**: T17
**Reuses**: Content map Guard code example (`AuthGuard`)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All documented constraints present (no Module-level, no MustInject in builder)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against content map Guard section.

---

### T21: Request Pipeline — Interceptors page [P]

**What**: Write `interceptors.mdx` documenting `NewInterceptor`/`Handler(func(ctx, next InterceptorNext))`, AOP before/after wrapping, controller-scoped-only.
**Where**: `content/docs/request-pipeline/interceptors.mdx`
**Depends on**: T17
**Reuses**: Content map Interceptor code example (`TimingInterceptor`)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Example matches content map
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T22: Request Pipeline — Filters & Exceptions page [P]

**What**: Write `filters.mdx` (`NewFilter`/`Catch(exemplar, handler)`, exact-type matching via `reflect.TypeOf`, `Controller.Filters`/`Module.Filters` precedence) and `exceptions.mdx` (`HttpException`, 5 built-ins, custom exception embedding pattern, panic-recovery contract, `HttpStatus*` constants).
**Where**: `content/docs/request-pipeline/filters.mdx`, `content/docs/request-pipeline/exceptions.mdx`
**Depends on**: T17
**Reuses**: Content map Filter (`FooFilter`) and Exceptions sections

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All 5 built-in exceptions listed with status codes
- [ ] Custom exception embedding example matches content map
- [ ] Panic-recovery contract (Exception→own status; other panic→generic 500, no leak) explicitly stated
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against content map Exceptions section.

---

### T23: Request Pipeline section index + cross-links

**What**: Write section `index.mdx` (if not already covered by T18) refinement + forward cross-links to Validation & Schemas section.
**Where**: `content/docs/request-pipeline/index.mdx` (finalize), minor edits to T19-T22 files
**Depends on**: T18, T19, T20, T21, T22
**Reuses**: N/A

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All pipeline pages cross-linked in reading order
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Click-through test of all forward links.

---

### T24: Validation — Schema Builder Basics page [P]

**What**: Write `content/docs/validation/index.mdx` documenting `NewSchema[T]`, `Property(&t.X)` pointer-identification pattern, base 4 constraints (`Required`/`Nullable`/`Description`/`Examples`), `Title()`.
**Where**: `content/docs/validation/index.mdx`
**Depends on**: T23
**Reuses**: Content map `userEntitySchema` example

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Example matches content map exactly (current names: `NewSchema`, `*Schema`, NOT `NewMetadata`/`*Metadata`)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check naming against content map's explicit naming-drift note.

---

### T25: Validation — String Family page [P]

**What**: Write `string-family.mdx` documenting all 10 string branches (`String`/`Email`/`Uuid`/`Uri`/`Hostname`/`Ipv4`/`Ipv6`/`Password`/`Byte`/`Binary`) with shared `Min`/`Max`/`Pattern`, OpenAPI format mapping per branch.
**Where**: `content/docs/validation/string-family.mdx`
**Depends on**: T23
**Reuses**: Content map String-family section

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All 10 branches listed with their OpenAPI `format` value
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check count and format strings against content map.

---

### T26: Validation — Numeric, Boolean, Date & Time page [P]

**What**: Write `numeric-boolean-datetime.mdx` documenting `Integer`/`Int32`/`Float`/`Double` (with `Min`/`Max`), `Boolean()` (wrapper-less), `DateTime()`/`Date()` (wrapper-less, format `date-time`/`date`).
**Where**: `content/docs/validation/numeric-boolean-datetime.mdx`
**Depends on**: T23
**Reuses**: Content map Numeric/Boolean/DateTime section

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Wrapper-less distinction (Boolean/Date/DateTime return bare `*PropertyBuilder`, no extra validators) explicitly called out
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T27: Validation — Array Builder page [P]

**What**: Write `array-builder.mdx` documenting the dual-state container/item pattern, `Items(func(m *ArrayMetadata){...})` callback semantics, post-`Items` chained `.Min(n)`/`.Max(n)` as item-COUNT bounds (vs. item's own bounds inside the callback), nested object array `$ref` reuse example.
**Where**: `content/docs/validation/array-builder.mdx`
**Depends on**: T23
**Reuses**: Content map Array Builder examples (both flat-string-array and nested-object-array)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Container-vs-item distinction has a dedicated Callout warning (common confusion point per spec.md AC4)
- [ ] Both code examples from content map present verbatim
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check both examples against content map; confirm Callout exists.

---

### T28: Validation — Object Builder page [P]

**What**: Write `object-builder.mdx` documenting single-state object field pattern, `om.Metadata(ref)` for `$ref` reuse, `om.AdditionalProperties()` for open schemas.
**Where**: `content/docs/validation/object-builder.mdx`
**Depends on**: T23
**Reuses**: Content map Object Builder examples (address reuse, open metadata)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Both examples present, matching content map
- [ ] Single-state vs. Array's dual-state contrast explicitly mentioned (cross-reference to T27)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T29: Validation — Runtime Validation page [P]

**What**: Write `runtime-validation.mdx` documenting `param:`/`query:`/`json:` tag families, `MustParseRestParams`/`MustParseRestQuery`/`MustParseRestJsonBody` + non-panicking `ParseRestXxx` twins, collect-all-violations behavior, recursive Array/Object validation, `Nullable`+`null` vs. absent-required-field distinction.
**Where**: `content/docs/validation/runtime-validation.mdx`
**Depends on**: T23
**Reuses**: Content map `userIdParamsSchema`/`UserController` example

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Non-panicking twin functions explicitly listed
- [ ] "absence ≠ null" edge case documented with a Callout
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against content map.

---

### T30: Validation — Custom Validators page [P]

**What**: Write `custom-validators.mdx` documenting `Custom(fn func(raw any) (any, error))` as the universal escape hatch across JSON body/params/query/form fields.
**Where**: `content/docs/validation/custom-validators.mdx`
**Depends on**: T23
**Reuses**: Content map Custom(fn) description

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Explicitly states this absorbed the removed `Pipe`/`NewPipe` concept (historical note optional per spec.md edge case)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T31: Multipart Form Streaming page [P]

**What**: Write `content/docs/multipart/index.mdx` documenting `form:` tag family, `MustParseRestFormBody`, `FormFile` (`Filename()`/`ContentType()`/`Reader()`), `route.FormBody(schema, fieldName)`, `AppOptions.EnableFormStreaming` (app-wide toggle), streaming trade-off Callout (files may already be processed via `onFile` before a later field fails).
**Where**: `content/docs/multipart/index.mdx`
**Depends on**: T23
**Reuses**: Content map Multipart Form Streaming example (S3 upload)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Trade-off Callout present (matches spec.md AC5 requirement)
- [ ] `EnableFormStreaming` app-wide (not per-route) scope explicitly stated
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against content map.

---

### T32: Validation & Multipart section indices + cross-links

**What**: Write/finalize `content/docs/validation/index.mdx` navigation summary (if T24 needs splitting from section-index vs. Schema-Basics-page) and cross-link T24-T31 in reading order; forward-link to OpenAPI section.
**Where**: `content/docs/validation/index.mdx`, `content/docs/multipart/index.mdx` (link edits)
**Depends on**: T24, T25, T26, T27, T28, T29, T30, T31
**Reuses**: N/A

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Full click-through path Schema Basics → String → Numeric/Bool/DateTime → Array → Object → Runtime Validation → Custom → Multipart works
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Manual click-through.

---

### T33: OpenAPI & Swagger page [P]

**What**: Write `content/docs/openapi/index.mdx` documenting `NewOpenAPI`/`Title`/`Description`/`Version`/`Contact`/`License`/`BearerAuth`, `GenerateOpenApiSchema`, `SetupSwagger`/`SwaggerOptions`, Route documentation methods (`Summary`/`Description`/`OperationId`/`Tags`/`BearerAuth`/`RequestBody`/`Response`/`PathParams`/`QueryParams`/`ExcludeFromDocs`/`Deprecated`), `$ref` dedup behavior, `Custom(fn)` field limitation in generated schema.
**Where**: `content/docs/openapi/index.mdx`
**Depends on**: T32
**Reuses**: Content map OpenAPI/Swagger example

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All Route documentation methods listed
- [ ] `Custom(fn)` fields' documented limitation (no type/format inferred) stated
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check against content map.

---

### T34: Emitter[P]

**What**: Write `content/docs/emitter/index.mdx` documenting `gonest.Emitter` (framework singleton, always injectable), `NewListener`/`MustOn[EventType]` (free function, not method), `Emitter.Emit` fire-and-forget/goroutine-per-listener/panic-recovery semantics, no wildcard events.
**Where**: `content/docs/emitter/index.mdx`
**Depends on**: T32
**Reuses**: Content map Emitterle (`UserCreatedEvent`)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Fire-and-forget/goroutine/panic-recovery behavior explicitly stated
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T35: Scheduler page [P]

**What**: Write `content/docs/scheduler/index.mdx` documenting `NewScheduler`/`Cron(name, expr, fn)`/`Interval(name, dur, fn)`/`Timeout(name, dur, fn)`/`Stop(name)`, per-job isolation (own recover, own goroutine).
**Where**: `content/docs/scheduler/index.mdx`
**Depends on**: T32
**Reuses**: Content map Scheduler example (`CleanupScheduler`)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Per-job isolation explicitly stated
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T36: Health Checks (Terminus-style) page [P]

**What**: Write `content/docs/health-checks/index.mdx` documenting the "just a normal Controller" pattern, `Pingable`/`Connectable` interface + `MustInjectAll`, `/readyz` (200/503 aggregation) vs. `/livez` (static 200, `SendString`) convention, new primitives `Context.SendString`/`HttpStatusOk`/`HttpStatusServiceUnavailable`.
**Where**: `content/docs/health-checks/index.mdx`
**Depends on**: T32
**Reuses**: Content map Health Checks example (`HealthController`)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Explicitly states there is no dedicated bootstrap type (deliberate design choice)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T37: Testing helpers page [P]

**What**: Write `content/docs/testing/index.mdx` documenting `MustNewTestApp`, `MustOverride[T]` (interface-only requirement explained), `tester.MustRequest`, `TestResponse.AssertStatus`/`AssertJsonPath`, HTTP verb aliases (`HttpGet`/`HttpPost`/etc.).
**Where**: `content/docs/testing/index.mdx`
**Depends on**: T32
**Reuses**: Content map Testing example

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `MustOverride`'s interface-only constraint explicitly explained (why: no vtable swap on concrete pointer)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check.

---

### T38: `.examples` walkthrough page [P]

**What**: Write `content/docs/getting-started/examples.mdx` (or a top-level "Examples" page) pointing to `.examples/simple-todo` and `.examples/blog-api` in the gonest repo, briefly describing what each demonstrates, with a GitHub link.
**Where**: `content/docs/getting-started/examples.mdx`
**Depends on**: T32
**Reuses**: Content map's mention of both examples

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Both examples described accurately (simple-todo = minimal MVC; blog-api = guards/interceptors/middleware/filters/OpenAPI/Swagger/SQLite/3-module)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check descriptions against content map.

---

### T39: Platform sections cross-links

**What**: Cross-link T33-T38 pages in a sensible reading order (OpenAPI → Emitter → Scheduler → Health Checks → Testing → Examples) and their section `index.mdx` files.
**Where**: `content/docs/{openapi,emitter,scheduler,health-checks,testing}/index.mdx` (link edits)
**Depends on**: T33, T34, T35, T36, T37, T38
**Reuses**: N/A

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Full click-through works
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Manual click-through.

---

### T40: Content-accuracy full pass (README diff audit)

**What**: Systematic line-by-line cross-check of every content page written in Phases 3-6 against `C:\dev\gonest-dev\gonest\README.md`, confirming zero spec-era names leaked in (`NewMetadata`, `MustJsonBody`, `MustParams`, `MustQuery`, `MustParam`, `Pipe`, `NewPipe`, `Context` as a bare type name instead of `RestContext`).
**Where**: All `content/docs/**/*.mdx` files (audit + fix pass, no new files)
**Depends on**: T17, T23, T32, T39
**Reuses**: N/A

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Zero occurrences of retired names found (grep-verified)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: `grep -rn "NewMetadata\|MustJsonBody\|MustParams\[\|MustQuery\[\|MustParam(\|NewPipe\|gonest.Pipe" content/docs` returns zero matches.

---

### T41: API Reference section index

**What**: Write `content/docs/api-reference/index.mdx` — an overview page listing every symbol group (Module, Provider, Controller, Route, Schema/PropertyBuilder branches, HttpException family, Middleware, Guard, Interceptor, Filter, Emitter, Scheduler, TestBuilder) each linking to its own reference page (created in T42).
**Where**: `content/docs/api-reference/index.mdx`
**Depends on**: T40
**Reuses**: Full symbol list from content map's "Implementation Status" table + per-section symbol names

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Every symbol group from the content map has a linked entry (even if target page is a stub until T42 completes)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Cross-check symbol-group list against content map completeness.

---

### T42: Generate individual API reference pages [P]

**What**: Write one `content/docs/api-reference/{symbol-group}.mdx` page per symbol group listed in T41 (e.g. `module.mdx`, `provider.mdx`, `controller.mdx`, `route.mdx`, `schema.mdx`, `exceptions.mdx`, `middleware.mdx`, `guard.mdx`, `interceptor.mdx`, `filter.mdx`, `emitter.mdx`, `scheduler.mdx`, `testing.mdx`), each listing every method/function with a 1-line signature + description, cross-linking back to the relevant conceptual page (e.g. `guard.mdx` links back to `request-pipeline/guards.mdx`).
**Where**: `content/docs/api-reference/*.mdx` (13 files)
**Depends on**: T41
**Reuses**: All conceptual pages from Phases 3-6 (reference pages are terser restatements, not new research)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All 13 reference pages exist and link back to their conceptual page
- [ ] No signature/name conflicts with the conceptual pages (single source of truth per symbol)
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: Spot-check 5 reference pages against their conceptual-page counterparts for consistency.

---

### T43: Go/WASM playground entrypoint

**What**: Create a small `wasm/cmd/playground/main.go` (in this site repo, importing `gonest` as a Go module dependency per design.md's site-local decision) exposing 3 JS-callable functions via `syscall/js`: validate-required-field-violation, validate-nested-array-item-violation, validate-custom-transform — each taking a JSON string, running real gonest schema/validation logic, returning a JSON result string.
**Where**: `wasm/go.mod`, `wasm/cmd/playground/main.go`
**Depends on**: T31 (Multipart/Validation content must exist so playground scenarios match documented examples)
**Reuses**: Real `gonest` schema/validation package (imported as external module, not reimplemented)

**Tools**:
- MCP: Context7 for `syscall/js` patterns if unfamiliar
- Skill: NONE

**Done when**:
- [ ] `go test ./...` passes for the 3 scenarios (unit-tested before WASM compilation)
- [ ] `GOOS=js GOARCH=wasm go build -o playground.wasm ./cmd/playground` succeeds
- [ ] Gate check passes: `go test ./...` (go-unit gate)
- [ ] Test count: 3 scenario tests pass

**Tests**: unit (go-unit)
**Gate**: go-unit

**Verify**: `go test ./...` shows 3 passing tests; `GOOS=js GOARCH=wasm go build` exits 0.

---

### T44: WASM build pipeline integration into Next.js

**What**: Add a build step (npm script or Next.js webpack/asset config) that compiles `wasm/cmd/playground` to `public/playground.wasm` and copies the matching `wasm_exec.js` into `public/`, running automatically before `next build`.
**Where**: `package.json` (build script), `public/wasm_exec.js`, `public/playground.wasm` (generated)
**Depends on**: T43
**Reuses**: Go toolchain's `misc/wasm/wasm_exec.js`

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `npm run build` produces `public/playground.wasm` and `public/wasm_exec.js` as build artifacts
- [ ] Gate check passes: `npm run build`

**Tests**: none
**Gate**: full

**Verify**: After `npm run build`, confirm both files exist in `.next`/`public` output.

---

### T45: WasmPlayground React component

**What**: Build `components/wasm-playground/index.tsx` — client component that lazy-loads `wasm_exec.js` + `playground.wasm`, renders an editable JSON input panel + output panel, calls the matching JS-global function on "Run", falls back to a static code display if WASM fails to load/instantiate.
**Where**: `components/wasm-playground/index.tsx`, `components/wasm-playground/loader.ts`
**Depends on**: T44
**Reuses**: A lightweight code/JSON editor (evaluate CodeMirror vs. a plain textarea per design.md — decide at implementation time based on bundle-size budget)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Component renders input/output panels
- [ ] "Run" triggers the WASM function and displays real validation output
- [ ] Simulated WASM-load failure (e.g. blocked network in test) shows fallback static example, not a broken UI
- [ ] Gate check passes: `npx playwright test` (e2e for this component) + `npm run build`

**Tests**: e2e
**Gate**: e2e

**Verify**: Playwright test: load a page with `<WasmPlayground scenario="required-field" />`, edit input to violate `Required`, click Run, assert violation text appears in output panel.

---

### T46: Embed WasmPlayground on Validation pages

**What**: Insert `<WasmPlayground scenario="..." />` embeds into `array-builder.mdx` (nested-array-item scenario), `runtime-validation.mdx` (required-field scenario), `custom-validators.mdx` (custom-transform scenario).
**Where**: `content/docs/validation/array-builder.mdx`, `runtime-validation.mdx`, `custom-validators.mdx` (edits)
**Depends on**: T45
**Reuses**: T45 component, T43 scenarios

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All 3 embeds render and function per T45's e2e test, now in real page context
- [ ] Gate check passes: `npm run build`

**Tests**: none (covered by T45's e2e; page embed is wiring only)
**Gate**: full

**Verify**: Load each of the 3 pages, manually run the playground once per page.

---

### T47: Prepare hosted demo API deployment target

**What**: Fork/copy `.examples/blog-api` into a small standalone deployable Go binary (or confirm it's already standalone), choose and configure a hosting platform (decision deferred from design.md — evaluate Fly.io/Render/Railway for free-tier static-cost fit), add a periodic/per-session state-reset mechanism (per spec.md edge case) so visitor-mutated demo data doesn't degrade the demo.
**Where**: New deploy config (e.g. `deploy/blog-api/Dockerfile` or platform-specific config), state-reset logic in the demo app itself
**Depends on**: T22 (Pipeline content must exist to know which endpoints need showcasing)
**Reuses**: `C:\dev\gonest-dev\gonest\.examples\blog-api` (entire example, unmodified core logic)

**Tools**:
- MCP: WebSearch (compare hosting platforms' free-tier terms if needed)
- Skill: NONE

**Done when**:
- [ ] Demo API deployed and reachable at a public URL
- [ ] State-reset mechanism verified (mutate data, confirm reset within the defined interval/session scope)
- [ ] `NEXT_PUBLIC_DEMO_API_URL` documented for site config

**Tests**: none (infra task, manually verified)
**Gate**: full (build/deploy succeeds)

**Verify**: `curl` a known public endpoint on the deployed URL, confirm real JSON response; mutate via POST, confirm reset behavior later.

---

### T48: TryItPanel React component

**What**: Build `components/try-it-panel/index.tsx` — client component taking `method`/`path`/optional schema props, rendering an editable request form, calling `fetch` against `NEXT_PUBLIC_DEMO_API_URL`, displaying real status/headers/JSON body, with an inline error state if unreachable.
**Where**: `components/try-it-panel/index.tsx`
**Depends on**: T47
**Reuses**: Demo API's own `/openapi.json` (fetched to auto-populate the request form per design.md)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Component sends real requests and renders real responses
- [ ] Unreachable-API state shows a scoped inline error, rest of page unaffected
- [ ] Gate check passes: `npx playwright test` + `npm run build`

**Tests**: e2e
**Gate**: e2e

**Verify**: Playwright test against the live deployed demo API (or a local mock server standing in for it in CI): send a request to a guarded route without auth header, assert a real 403 renders.

---

### T49: Embed TryItPanel on Pipeline/OpenAPI pages

**What**: Insert `<TryItPanel method="..." path="..." />` embeds into `request-pipeline/guards.mdx` (guarded-route example), `openapi/index.mdx` (documented-route example), and one public unguarded route example on `request-pipeline/index.mdx`.
**Where**: `content/docs/request-pipeline/guards.mdx`, `content/docs/openapi/index.mdx`, `content/docs/request-pipeline/index.mdx` (edits)
**Depends on**: T48
**Reuses**: T48 component

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All 3 embeds render and function
- [ ] Gate check passes: `npm run build`

**Tests**: none (covered by T48's e2e; page embed is wiring only)
**Gate**: full

**Verify**: Load each page, manually send one request per embed.

---

### T50: Interactivity resilience check

**What**: Verify both WasmPlayground and TryItPanel failures are fully isolated — simulate WASM load failure and demo API downtime simultaneously, confirm all static page content remains fully readable/functional on every page that embeds either component.
**Where**: N/A (verification task, may add defensive code if a gap is found in `components/wasm-playground/` or `components/try-it-panel/`)
**Depends on**: T46, T49
**Reuses**: T45, T48 error-handling paths

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Simulated dual-failure leaves all 6 embedding pages fully readable
- [ ] Gate check passes: `npx playwright test` + `npm run build`

**Tests**: e2e
**Gate**: e2e

**Verify**: Playwright test: block `.wasm` and demo-API-domain network requests, load each of the 6 embedding pages, assert page text content still renders (no error boundary crash).

---

### T51: Full-site lint + typecheck + build gate

**What**: Run the complete quick + full gate across the entire site after all content and components exist; fix any lingering lint/type errors.
**Where**: N/A (fix-as-needed across repo)
**Depends on**: T42, T46, T50
**Reuses**: N/A

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] Gate check passes: `npm run lint && npm run typecheck && npm run build`

**Tests**: none
**Gate**: full

**Verify**: All 3 commands exit 0 in sequence.

---

### T52: Full search spot-check (20 queries)

**What**: Manually (or via a small Playwright script) verify search returns the correct top-3 result for the 20 spot-check queries listed in spec.md's Success Criteria (`MustInject`, `NewSchema`, `Guard`, `Interceptor`, `Filter`, `Emitter`, `Scheduler`, `MustParseRestJsonBody`, `SetupSwagger`, `MustNewTestApp`, plus 10 more covering remaining sections).
**Where**: N/A (verification task; may add missing frontmatter/headings if a query fails to surface the right page)
**Depends on**: T51
**Reuses**: T9 search wiring

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] All 20 queries return their expected page in the top 3 results
- [ ] Gate check passes: `npx playwright test`

**Tests**: e2e
**Gate**: e2e

**Verify**: Playwright test iterating the 20 queries, asserting expected page URL appears in the top-3 result set for each.

---

### T53: Launch readiness review

**What**: Final manual pass against spec.md's full Success Criteria checklist (content completeness, search spot-checks, WASM scenarios, Try-it endpoints, perf/static-generation confirmation); record any deferred items in `.specs/project/STATE.md`.
**Where**: N/A (review + STATE.md update)
**Depends on**: T51, T52
**Reuses**: spec.md Success Criteria section

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Every Success Criteria item in spec.md is checked off or explicitly deferred with reason
- [ ] `.specs/project/STATE.md` created/updated with any deferred items, decisions, and next-milestone notes

**Tests**: none
**Gate**: full

**Verify**: Read spec.md Success Criteria top to bottom, confirm each line has a checked box or documented deferral.

---

## Parallel Execution Map

```
Phase 1 (Sequential):        T1 → T2 → T3 → T4 → T5
Phase 2 (Parallel):          T5 done → { T6, T7, T8, T9 } → T10
Phase 3 (Parallel):          T10 done → { T11, T12, T13, T14, T15, T16 } → T17
Phase 4 (Parallel):          T17 done → { T18, T19, T20, T21, T22 } → T23
Phase 5 (Parallel):          T23 done → { T24..T31 } → T32
Phase 6 (Parallel):          T32 done → { T33..T38 } → T39 → T40
Phase 7 (Sequential→Parallel): T40 → T41 → T42 [P, 13 files]
Phase 8 (Sequential):        T31 → T43 → T44 → T45 → T46
Phase 9 (Sequential):        T22 → T47 → T48 → T49
Phase 10 (Sequential):       { T42, T46, T49 } → T50 → T51 → T52 → T53
```

**Parallelism constraint reminder:** Content-authoring tasks within a phase (e.g. T24-T31) touch independent MDX files — no shared mutable state, all parallel-safe per TESTING.md. WasmPlayground (T45) and TryItPanel (T48) e2e tasks run sequentially relative to each other if sharing a Playwright worker/browser context, per TESTING.md Parallelism Assessment.

---

## Task Granularity Check

| Task    | Scope                                               | Status                                                                                                                                                                                                                               |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T1-T9   | 1 config/component each                             | ✅ Granular                                                                                                                                                                                                                           |
| T11-T38 | 1-2 related MDX pages each (cohesive, same section) | ✅ Granular (2-page tasks are same topic, same file type)                                                                                                                                                                             |
| T42     | 13 reference pages, same template, same review pass | ⚠️ Marked [P] as one batch task — acceptable since it's mechanical restatement of already-researched content, not new design work; could be split into 13 sub-tasks if a sub-agent-per-file parallelization is desired during Execute |
| T43-T50 | 1 component/pipeline step each                      | ✅ Granular                                                                                                                                                                                                                           |
| T51-T53 | 1 verification pass each                            | ✅ Granular                                                                                                                                                                                                                           |

---

## Diagram-Definition Cross-Check

| Task            | Depends On (task body) | Diagram Shows                                       | Status  |
| --------------- | ---------------------- | --------------------------------------------------- | ------- |
| T1              | None                   | None                                                | ✅ Match |
| T2              | T1                     | T1→T2                                               | ✅ Match |
| T3              | T1                     | T1→...→T3 (sequential chain)                        | ✅ Match |
| T4              | T3                     | T3→T4                                               | ✅ Match |
| T5              | T4                     | T4→T5                                               | ✅ Match |
| T6,T7,T8,T9     | T5 (each)              | T5→{T6,T7,T8,T9}                                    | ✅ Match |
| T10             | T6,T7,T8,T9            | {T6,T7,T8,T9}→T10                                   | ✅ Match |
| T11,T12         | T10                    | T10→{T11,T12,...}                                   | ✅ Match |
| T13,T14,T15,T16 | T10                    | T10→{...,T13,T14,T15,T16}                           | ✅ Match |
| T17             | T13,T14,T15,T16        | {T13-T16}→T17                                       | ✅ Match |
| T18-T22         | T17                    | T17→{T18..T22}                                      | ✅ Match |
| T23             | T18,T19,T20,T21,T22    | {T18-T22}→T23                                       | ✅ Match |
| T24-T31         | T23                    | T23→{T24..T31}                                      | ✅ Match |
| T32             | T24..T31               | {T24-T31}→T32                                       | ✅ Match |
| T33-T38         | T32                    | T32→{T33..T38}                                      | ✅ Match |
| T39             | T33-T38                | {T33-T38}→T39                                       | ✅ Match |
| T40             | T17,T23,T32,T39        | shown as gate after all content phases              | ✅ Match |
| T41             | T40                    | T40→T41                                             | ✅ Match |
| T42             | T41                    | T41→T42[P]                                          | ✅ Match |
| T43             | T31                    | T31→T43                                             | ✅ Match |
| T44             | T43                    | T43→T44                                             | ✅ Match |
| T45             | T44                    | T44→T45                                             | ✅ Match |
| T46             | T45                    | T45→T46                                             | ✅ Match |
| T47             | T22                    | T22→T47                                             | ✅ Match |
| T48             | T47                    | T47→T48                                             | ✅ Match |
| T49             | T48                    | T48→T49                                             | ✅ Match |
| T50             | T46,T49                | {T46,T49}→T50                                       | ✅ Match |
| T51             | T42,T46,T50            | {T42,T46,T50}→T51 (T49 folded into T50's dep chain) | ✅ Match |
| T52             | T51                    | T51→T52                                             | ✅ Match |
| T53             | T51,T52                | {T51,T52}→T53                                       | ✅ Match |

---

## Test Co-location Validation

| Task    | Code Layer Created/Modified            | Matrix Requires             | Task Says                    | Status |
| ------- | -------------------------------------- | --------------------------- | ---------------------------- | ------ |
| T1-T5   | Fumadocs config/theme/MDX registration | build + lint                | none/quick (build+typecheck) | ✅ OK   |
| T6-T10  | Layout/theme/search/hero shell         | build + lint                | full/e2e (T9 search)         | ✅ OK   |
| T11-T39 | MDX content pages                      | none (manual review)        | none                         | ✅ OK   |
| T40     | Content audit (no new code)            | none                        | none                         | ✅ OK   |
| T41-T42 | MDX content pages                      | none                        | none                         | ✅ OK   |
| T43     | Go/WASM entrypoint                     | go-unit                     | unit (go-unit)               | ✅ OK   |
| T44     | Build pipeline config                  | build + lint                | none/full                    | ✅ OK   |
| T45     | WasmPlayground component               | e2e                         | e2e                          | ✅ OK   |
| T46     | MDX embeds (wiring only)               | none (covered by T45's e2e) | none                         | ✅ OK   |
| T47     | Infra/deploy config                    | none (manual verify)        | none/full                    | ✅ OK   |
| T48     | TryItPanel component                   | e2e                         | e2e                          | ✅ OK   |
| T49     | MDX embeds (wiring only)               | none (covered by T48's e2e) | none                         | ✅ OK   |
| T50     | Resilience verification                | e2e                         | e2e                          | ✅ OK   |
| T51     | Full-site gate                         | build + lint                | full                         | ✅ OK   |
| T52     | Search verification                    | e2e                         | e2e                          | ✅ OK   |
| T53     | Review/STATE.md update                 | none                        | none                         | ✅ OK   |

All tasks pass both cross-checks. No restructuring needed.

---

## MCPs and Skills Confirmation Needed

Before Execute begins, confirm:

- **Context7 MCP**: available and should be used for Fumadocs API lookups (T1-T9, T43) — already used during Design; continue in Execute for any API details not yet verified.
- **mermaid-studio skill**: check availability before T18 (Pipeline execution-order diagram); fall back to inline mermaid if not installed.
- **WebSearch**: needed for T47 (hosting platform comparison) unless user already has a preferred platform.
