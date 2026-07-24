# Codebase & Documentation Conventions

## Documentation & Code Example Principles

### 1. Mandatory Code Examples (NestJS/TS Developer Ergonomics)

- **Requirement**: Every documented symbol, struct, builder method, pipeline stage, and core concept MUST include a practical, copy-pasteable Go code example (even if minimal).
- **Rationale**: GoNest's primary mission is to provide JS/TS developers coming from NestJS with a familiar, ergonomic Go framework without the usual steep friction or stiffness of standard Golang patterns. Abstract tables or method descriptions without usage context violate this mission.
- **Comparison / Mental Models**: Where appropriate, draw mental bridges to NestJS equivalents (e.g., `ProviderAs` mapping to NestJS interface provider tokens like `{ provide: 'IUserRepository', useClass: PgUserRepository }`).

### 2. Naming Conventions for References

- **Trailing Underscore (`_`)**: By convention in GoNest projects, declared reference variables (`*Module`, `*Controller`, `*Provider`, `*Middleware`, `*Guard`, `*Filter`, `ProviderAs` interface aliases) MUST NOT use the `*Ref` suffix (e.g. avoid `UserModuleRef`, `PgRepoRef`). Instead, suffix reference variables with a trailing underscore `_` (e.g. `UserModule_`, `UserController_`, `UserRepository_`, `PgUserRepository_`, `UserServiceProvider_`).

### 3. API Naming & Usage Accuracy

- **Current Names Only**: All code examples in documentation MUST use current, production-accurate GoNest API names (`NewSchema`, `MustParseRestJsonBody`, `ProviderAs`, `MustInject`, `MustInjectAll`, `RestContext`).
- **No Pseudo-Code**: Snippets should look like real, runnable Go code, including necessary package imports (`"github.com/gonest/gonest"`) and signature shapes.
- **Swagger Metadata in Controllers**: Controller documentation examples MUST demonstrate how to chain OpenAPI / Swagger reference declarations (`Summary`, `Description`, `Tags`, `RequestBody`, `PathParams`, `QueryParams`, `Response`).

### 4. Structure of API Reference Pages

Each API reference page MUST follow this structure:
1. **Title & Signature Overview**: High-level builder signature or constructor.
2. **Method / Function Summary**: Table listing parameters, return types, and descriptions.
3. **Usage Examples**: Dedicated code example block(s) for key methods or function families (e.g., interface binding with `ProviderAs`, resolving via `MustInject`).
4. **Cross-References**: Links to related core concepts or pipeline guides.
