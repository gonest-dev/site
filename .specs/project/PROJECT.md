# gonest Documentation Site

**Vision:** A Fumadocs-powered documentation website for gonest (a NestJS-inspired DI/HTTP framework for Go), giving JS/TS developers evaluating a Go backend migration the same polished onboarding experience they get from better-auth, Hono, and Drizzle docs.
**For:** JS/TS developers evaluating or adopting gonest for a Go backend; existing gonest users needing API reference.
**Solves:** gonest currently only has a 571-line README and internal `.specs` files — no navigable, searchable, example-rich documentation site. Developers must read source/spec files to understand DI scopes, the request pipeline, schema builders, and OpenAPI generation.

## Goals

- Ship a documentation site covering 100% of gonest's shipped v1+ capabilities (DI/Modules, Exceptions, Pipeline, Schema/Validation, Multipart, OpenAPI/Swagger, Emitter, Scheduler, Terminus, Testing) with accurate, copy-pasteable Go code examples.
- Match the polish bar of better-auth/Hono/Drizzle docs: simple hero, minimal sidebar, instant search, dark theme, custom MDX components (Callout, Steps, Tabs, Cards).
- Deliver genuine interactivity for a Go framework in a static-friendly site: an in-browser WASM playground for schema/validation logic + a hosted live demo API with "Try it" request panels for full HTTP pipeline examples.

## Tech Stack

**Core:**

- Framework: Fumadocs (fumadocs-ui + fumadocs-core) on Next.js (App Router)
- Language: TypeScript (site), Go 1.18+ (WASM playground + hosted demo API, sourced from gonest's `.examples/`)
- Content: MDX

**Key dependencies:** fumadocs-ui, fumadocs-core, fumadocs-mdx, next, shiki (code highlighting via Fumadocs defaults), Go `GOOS=js GOARCH=wasm` toolchain for the playground bundle.

## Scope

**v1 includes:**

- Full docs IA: Getting Started, Core Concepts (Modules/Providers/Controllers/DI scopes), Request Pipeline (Middleware/Guard/Interceptor/Filter), Validation & Schema Builders (String/Numeric/Boolean/DateTime/Array/Object families), Multipart Form Streaming, OpenAPI/Swagger, Event Emitter, Scheduler, Health Checks (Terminus-style), Testing.
- Custom MDX components: Callout, Steps, Tabs, Cards (Fumadocs ships Tabs/Cards/Callout natively — confirm and extend as needed).
- Instant/fuzzy search (Fumadocs built-in search, Orama-based).
- Dark theme as the polished default, light theme supported.
- WASM-based interactive playground: edit a schema/validation snippet, see live parsed/validation output client-side, no network calls.
- Hosted live demo API (deployed from gonest's `.examples/blog-api`) with embedded "Try it" request panels (method/path/body editor + real response) for pipeline/DI-level examples.
- API reference pages generated/maintained for all exported gonest symbols named in the content map (Module, Provider, Controller, Route, Schema, PropertyBuilder branches, HttpException, Middleware, Guard, Interceptor, Filter, Emitter, Scheduler, TestBuilder, etc.).

**Explicitly out of scope:**

- Versioned docs (multiple gonest versions side-by-side) — gonest has no stable release yet (v0.x, no tags).
- i18n / multi-language docs.
- Blog/changelog subsystem beyond a simple release-notes page (if needed later).
- Full arbitrary Go code execution in-browser (running any user-supplied Go program) — only the pre-defined WASM playground scenarios ship in v1.
- Contribution/community pages (Discord, forum) — no such community infra exists yet per PROJECT.md/README.

## Constraints

- Technical: gonest has no LICENSE file and no tagged release yet — docs must not claim a stable version; install instructions use the module path without a version guarantee callout.
- Technical: Naming drift exists between `.specs/features/*/spec.md` (older names like `NewMetadata`, `MustJsonBody`) and the current README API (`NewSchema`, `MustParseRestJsonBody`). Docs MUST use the current README-accurate names exclusively.
- Source of truth: content is derived from `C:\dev\gonest-dev\gonest\README.md` and `.specs\features\*\spec.md` (INSIGHT files explicitly excluded per user instruction).
