---
description: "Clean code principles for the dep-incubation-dashboard monorepo. Apply to all TypeScript source files across backend and frontend."
applyTo: "**/*.{ts,tsx}"
---
# Clean Code Instructions

## Naming Conventions

- **Variables/functions**: `camelCase` — descriptive, no abbreviations (`getUserById`, not `getUsr`)
- **Classes/interfaces/types**: `PascalCase` (`SkillMatrixService`, `CreateUserDto`)
- **Constants**: `UPPER_SNAKE_CASE` for true constants (`MAX_SKILL_VALUE = 100`)
- **Files**: `kebab-case` (`skill-matrix.service.ts`, `use-auth-store.ts`)
- **Boolean variables**: prefix with `is`, `has`, `should` (`isLoading`, `hasPermission`)

## Functions

- Single responsibility — one function does one thing
- Max 20 lines per function; extract helpers if longer
- Max 3 parameters; use an options object for more
- Pure functions preferred — avoid side effects where possible
- Always specify return types on exported functions

## Error Handling

- Never swallow errors silently — always log or re-throw
- Use domain-specific error types (NestJS: `NotFoundException`, `ConflictException`)
- Frontend: handle API errors via React Query's `onError` or error boundaries
- Never use `any` to silence TypeScript — use `unknown` and narrow

## Code Organization

- Imports order: external packages → internal modules → relative files → types
- Group related code together; separate concerns into modules
- No dead code — remove unused imports, variables, and functions
- No commented-out code in commits

## TypeScript Strictness

- Strict mode enabled — respect all strict checks
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `readonly` for properties that shouldn't change
- Avoid type assertions (`as`) — prefer type guards and narrowing
- Use discriminated unions for state modeling

## DRY Without Over-Abstracting

- Extract shared logic only when used 3+ times
- Prefer composition over inheritance
- Co-locate code that changes together
- Don't create abstractions for hypothetical future needs
