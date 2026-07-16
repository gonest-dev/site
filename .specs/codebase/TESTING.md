# Testing Strategy

Greenfield Fumadocs/Next.js site. Content is MDX prose (nothing to unit-test); the only real runtime logic lives in two isolated interactive components (WasmPlayground, TryItPanel) and the search index.

## Test Coverage Matrix

| Code Layer                                           | Test Type                                              | Parallel-Safe                             |
| ---------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| MDX content pages                                    | none (manual README cross-check for accuracy)          | Yes                                       |
| Fumadocs config / theme / MDX component registration | build + lint                                           | Yes                                       |
| WasmPlayground component                             | e2e (Playwright)                                       | No (shares WASM asset load, run isolated) |
| TryItPanel component                                 | e2e (Playwright)                                       | No (hits live network endpoint)           |
| Search (Cmd+K)                                       | e2e (Playwright)                                       | Yes                                       |
| WASM Go entrypoint (`cmd/wasmplayground`)            | Go unit test (validate logic before compiling to WASM) | Yes                                       |

## Gate Check Commands

| Gate    | Command                                                           |
| ------- | ----------------------------------------------------------------- |
| quick   | `pnpm lint && pnpm types:check`                                    |
| full    | `pnpm build` (includes static generation + search index build)    |
| e2e     | `pnpm exec playwright test`                                       |
| go-unit | `go test ./...` (run inside the WASM entrypoint module)           |

Package manager: **pnpm** (repo ships `pnpm-lock.yaml`/`pnpm-workspace.yaml`). Lint runs via `oxlint` (not eslint); typecheck runs via the `types:check` script (`fumadocs-mdx && next typegen && tsc --noEmit`).

## Parallelism Assessment

- Content-authoring tasks (MDX pages) are parallel-safe — independent files, no shared state.
- WasmPlayground and TryItPanel e2e tasks are NOT parallel-safe with each other if they share a dev-server port/browser context; run sequentially or with isolated Playwright workers.
- Build/lint gate tasks are parallel-safe (read-only checks).
