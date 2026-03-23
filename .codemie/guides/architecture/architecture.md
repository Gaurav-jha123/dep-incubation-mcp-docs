---
# Architecture Guide

**Project**: dep-incubation-dashboard
**Style**: Turborepo Monorepo — Layered NestJS (API) + Feature-Sliced React (Web)
**Language**: TypeScript | **Framework**: NestJS 11 (API), React 19 (Web)

---

## Architecture Overview

```
dep-incubation-dashboard/
├── apps/api/      ← NestJS REST API (Node.js ESM, Prisma, PostgreSQL)
└── apps/web/      ← React SPA (Vite, TanStack Query, Zustand, shadcn/ui)
```

```
API Layer Flow:
  HTTP Request
    → Controller (route + Swagger + guard)
      → Service (business logic via PrismaService)
        → PrismaService → PostgreSQL

Web Layer Flow:
  Route (lazy-loaded page)
    → Feature Component
      → useQuery / useMutation (TanStack Query)
        → apiClient (auth + refresh)
          → API /api/v1/*
```

---

## Backend: NestJS Layered Architecture

### Component Structure

```
apps/api/src/
├── main.ts                   Entry point + Vercel serverless handler
├── app.module.ts             Root module
├── prisma/                   Global PrismaService (@Global)
└── modules/
    ├── auth/                 JWT auth (signup/login/refresh/logout/me)
    └── skill-matrix/         Skill matrix CRUD
        ├── *.controller.ts   Routes, Swagger, guards
        ├── *.service.ts      Business logic
        └── dto/              Input validation (class-validator)
```

### Layer Responsibilities

| Layer | Responsibility | Depends On |
|-------|----------------|------------|
| Controller | HTTP routing, Swagger docs, guards | Service |
| Service | Business logic, data access | PrismaService |
| PrismaService | Database connection (global) | PostgreSQL |
| DTO | Input shape + validation | class-validator |
| Guard | JWT auth enforcement | JwtStrategy |

### Dependency Rules

- ✅ Controllers depend on Services
- ✅ Services depend on `PrismaService` (globally injected — no import of `PrismaModule` needed)
- ❌ Controllers never call `PrismaService` directly
- ❌ Never instantiate `PrismaClient` directly — always use `PrismaService`

---

## Frontend: Feature-Sliced Architecture

### Component Structure

```
apps/web/src/
├── features/           Page-level feature modules
│   ├── authentication/ Login page + form
│   ├── dashboard/      Dashboard + KPI components
│   ├── skillMatrix/    Skill matrix table + filters
│   └── reports/        PDF export + charts
├── components/
│   ├── atoms/          Basic UI (Button, Input, Badge...)
│   ├── molecules/      Composed (Card, Alert, Toast...)
│   ├── organisms/      Complex (Table, Modal, Pagination...)
│   └── ui/             shadcn/ui generated components
├── store/              Zustand stores (auth only)
├── services/
│   ├── api/            apiClient, auth.api.ts
│   └── hooks/          TanStack Query mutations/queries
├── providers/          QueryClientProvider
└── layout/             Shell: Sidebar + Header + Outlet
```

### State Architecture

| State Type | Tool | Persistence |
|------------|------|-------------|
| Auth (user, isLoggedIn) | Zustand + `persist` | localStorage |
| Access token | Zustand (memory only) | None |
| Server data | TanStack Query | Query cache |
| Form state | React Hook Form | Component scope |

---

## Design Patterns

| Pattern | Usage | Location |
|---------|-------|----------|
| Dependency Injection | NestJS constructor injection | All modules |
| Repository (via ORM) | `PrismaService` as data layer | `apps/api/src/prisma/` |
| Guard | JWT protection on routes | `modules/auth/guards/` |
| Refresh + Retry Queue | 401 → refresh → retry | `apps/web/src/services/api/client.ts:40` |
| Lazy Loading | React routes loaded on demand | `src/route-config.tsx` |

---

## Adding a New Feature Module (Backend)

1. Create `src/modules/<feature>/` with: `module.ts`, `controller.ts`, `service.ts`, `dto/`
2. Register `<Feature>Module` in `app.module.ts` imports
3. Use `.js` extensions in all relative imports
4. Inject `PrismaService` — do NOT import `PrismaModule`
5. Add `@ApiTags`, `@ApiOperation`, `@ApiResponse` to controller

## Adding a New Page (Frontend)

1. Create `src/features/<feature>/<Feature>.tsx`
2. Add lazy route in `src/route-config.tsx`
3. Add API function in `src/services/api/<feature>.api.ts`
4. Add TanStack Query hook in `src/services/hooks/`

---

## Configuration Flow

| Config Type | Location | Access |
|-------------|----------|--------|
| Backend env | `apps/api/.env` | `ConfigService.get('KEY')` |
| Frontend env | `apps/web/.env` | `import.meta.env.VITE_*` |
| DB connection | `DATABASE_URL` in `.env` | `PrismaService` via `ConfigService` |

---

## Quick Reference

| Need | Location |
|------|----------|
| API entry point | `apps/api/src/main.ts` |
| Route modules | `apps/api/src/modules/` |
| Global DB service | `apps/api/src/prisma/prisma.service.ts` |
| Frontend routes | `apps/web/src/route-config.tsx` |
| API client | `apps/web/src/services/api/client.ts` |
| Auth store | `apps/web/src/store/use-auth-store/use-auth-store.ts` |
| Prisma schema | `apps/api/prisma/schema.prisma` |
