---
name: "Framework Utilities"
description: "Common commands and tool references for the dep-incubation-dashboard monorepo — pnpm, Turbo, Prisma, Vite, and testing tools."
---
# Framework Utilities Toolset

## Package Manager — pnpm

```bash
pnpm install                              # Install all workspace dependencies
pnpm add <pkg> --filter=@dep-incubation-dashboard/web     # Add to frontend
pnpm add <pkg> --filter=@dep-incubation-dashboard/api     # Add to backend
pnpm remove <pkg> --filter=<workspace>    # Remove a dependency
```

## Turborepo — Orchestration

```bash
pnpm build                   # Build all apps
pnpm dev                     # Dev servers for all apps
pnpm lint                    # Lint all apps
pnpm test                    # Run tests in all apps
pnpm dev --filter=web        # Dev only frontend
pnpm dev --filter=api        # Dev only backend
```

## Backend Utilities (apps/api/)

```bash
cd apps/api
pnpm dev                     # NestJS watch mode
pnpm build                   # Compile to dist/
pnpm test                    # Jest unit tests (ESM)
pnpm test:e2e                # End-to-end tests
pnpm prisma:generate         # Regenerate Prisma client
pnpm prisma:migrate          # Run pending migrations
pnpm prisma:studio           # Open Prisma Studio GUI
pnpm prisma:seed             # Seed the database
pnpm lint                    # ESLint with auto-fix
```

## Frontend Utilities (apps/web/)

```bash
cd apps/web
pnpm dev                     # Vite dev server (localhost:5173)
pnpm build                   # TypeScript check + Vite production build
pnpm test                    # Vitest in watch mode
pnpm test:ci                 # Vitest single-run (CI)
pnpm test:coverage           # Vitest with coverage report
pnpm test:e2e                # Playwright (all browsers)
pnpm test:e2e:ui             # Playwright interactive UI
pnpm storybook               # Storybook dev (localhost:6006)
pnpm lint                    # ESLint with auto-fix
```

## Database (Prisma)

```bash
# Schema location: apps/api/prisma/schema.prisma
# Migrations:      apps/api/prisma/migrations/
# Seed script:     apps/api/prisma/seed.ts

# Create a new migration after schema changes
cd apps/api && npx prisma migrate dev --name <migration_name>

# Reset database (drops + recreates + seeds)
cd apps/api && npx prisma migrate reset

# View database in browser
cd apps/api && npx prisma studio
```

## Code Generation Patterns

### New NestJS Module
```bash
cd apps/api
npx nest generate module modules/<name>
npx nest generate controller modules/<name>
npx nest generate service modules/<name>
```

### New React Component (shadcn/ui)
```bash
cd apps/web
npx shadcn@latest add <component-name>
```

## Path Aliases

| Alias | Resolves To         | Scope    |
|-------|---------------------|----------|
| `@/*` | `./src/*`           | Frontend |
