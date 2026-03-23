# Copilot Chat Instructions

You are assisting with the **dep-incubation-dashboard** — a monorepo for tracking developer skill assessments and incubation progress.

## Project Overview

| App        | Path         | Stack                                      |
|------------|-------------|---------------------------------------------|
| **Backend**  | `apps/api/`  | NestJS 11, Prisma 7, PostgreSQL, JWT auth  |
| **Frontend** | `apps/web/`  | React 19, Vite 7, Tailwind 4, shadcn/ui   |

**Monorepo tools**: pnpm workspaces, Turborepo, ESLint 9 (flat config), Conventional Commits.

## Key Conventions

- **ESM everywhere** — both apps use `"type": "module"`. Backend requires `.js` extensions in relative imports.
- **Strict TypeScript** — no `any`, no type assertions unless unavoidable. Use `unknown` + narrowing.
- **API prefix**: all backend routes are under `/api/v1`.
- **Auth**: JWT access + refresh tokens. Protected routes use `@UseGuards(JwtAuthGuard)`.
- **State management**: Zustand for auth state, TanStack Query for server state.
- **Styling**: Tailwind CSS utility classes + shadcn/ui components. No inline styles or CSS modules.
- **Testing**: Jest (backend), Vitest (frontend unit), Playwright (E2E), Storybook (component).

## When Writing Code

1. Follow existing patterns — check neighboring files before creating new ones.
2. Co-locate tests with source: `feature.service.ts` → `feature.service.spec.ts`.
3. Every API endpoint needs Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
4. DTOs use `class-validator` decorators for validation.
5. Frontend forms use `react-hook-form` + `zod` schemas from `lib/schema/`.
6. Use the path alias `@/` for imports in the frontend (resolves to `src/`).

## When Answering Questions

- Reference specific file paths when explaining code.
- Provide runnable commands — don't assume the user knows the project scripts.
- If a question spans backend + frontend, address both sides.
