# Feature Specification: Mandatory Code Examples for Documentation

## Problem Statement

GoNest is designed to bring NestJS / TypeScript developers to Go without the steep syntax rigidity and unfamiliar patterns of traditional Go frameworks. However, abstract API tables without concrete usage examples (e.g. `ProviderAs`) create friction for developers looking to understand how interface binding and dependency injection resolution work in GoNest.

## Requirements

### REQ-CE-01: Mandatory Minimal Code Examples
- **Requirement**: Every API reference page and core concept page MUST include runnable-looking Go code examples demonstrating the usage of all exported functions, methods, and types.
- **Traceability**: Linked to `.specs/codebase/CONVENTIONS.md` and `PROJECT.md` goals.

### REQ-CE-02: Interface Binding & Resolution Documentation (`ProviderAs`, `MustInject`, `MustInjectAll`)
- **Requirement**: The `Provider` API reference pages (`provider.mdx`, `provider.pt.mdx`, `provider.es.mdx`) MUST include explicit code examples showing:
  1. Registering a concrete struct constructor via `gonest.NewProvider`.
  2. Binding the constructor to an interface via `gonest.ProviderAs[T]`.
  3. Registering both providers in a `gonest.Module`.
  4. Resolving the interface implementation using `gonest.MustInject[T]` and `gonest.MustInjectAll[T]`.

## Acceptance Criteria

1. WHEN viewing `api-reference/provider` in any language (en, pt, es) THEN the page SHALL render an explicit "Code Examples" / "Exemplos de Código" section.
2. WHEN reading the `ProviderAs` description THEN the user SHALL see a complete Go snippet demonstrating how to define an interface, implement it, bind it with `ProviderAs[T]`, and resolve it via `MustInject[T]`.
3. WHEN running `pnpm build` THEN the static site SHALL build without any MDX syntax errors.
