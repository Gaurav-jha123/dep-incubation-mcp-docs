# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Purpose**: AI-optimized execution guide for Claude Code agents working with the dep-incubation-dashboard codebase

---

## 🚨 CRITICAL RULES (Check Every Task)

| Rule | Trigger | Action |
|------|---------|--------|
| **Check Guides First** | ANY task/prompt | ALWAYS check relevant guides BEFORE searching codebase |
| **ESM Imports** | ANY file in `apps/api/` | Use `.js` extension on all relative imports |
| **Testing** | User says "test", "write tests", "run tests" | ONLY then work on tests |
| **Git Ops** | User says "commit", "push", "PR", "branch" | ONLY then do git operations |
| **Shell** | ANY shell command | ONLY bash/Linux syntax |

**Recovery**: If stuck → Check [Troubleshooting](#-troubleshooting)

---

## 📚 GUIDE IMPORTS

| Category | Guide Path | Purpose |
|----------|------------|---------|
| Architecture | .codemie/guides/architecture/architecture.md | Monorepo layers, NestJS + React structure, data flow, adding features |
| API Development | .codemie/guides/api/api-patterns.md | REST endpoint conventions, Swagger, validation, guards, pagination |
| Data & Database | .codemie/guides/data/data-patterns.md | Prisma 7 queries, migrations, models, connection setup |
| Testing | .codemie/guides/testing/testing-patterns.md | Jest (API) + Vitest/RTL (Web) + Playwright patterns |
| Development Practices | .codemie/guides/development/development-practices.md | Naming, error handling, logging, env config, hooks |
| Frontend Patterns | .codemie/guides/development/frontend-patterns.md | React components, Zustand, TanStack Query, routing, apiClient |
| Security | .codemie/guides/security/security-patterns.md | JWT auth, guards, validation, secrets, token security |

---

## ⚡ TASK CLASSIFIER

**Analyze request intent → Match category → Load appropriate guides**

| Category | User Intent / Purpose | Example Requests | P0 Guide | P1 Guide |
|----------|----------------------|------------------|----------|----------|
| **Architecture** | Design decisions, system structure, where to put code | "How should I structure?", "Where should this go?" | .codemie/guides/architecture/architecture.md | - |
| **API Development** | Creating/modifying endpoints, DTOs, controllers | "Add endpoint for...", "Create API to..." | .codemie/guides/api/api-patterns.md | .codemie/guides/security/security-patterns.md |
| **Data & Database** | Prisma queries, schema changes, migrations | "Add new table", "Query database", "Run migration" | .codemie/guides/data/data-patterns.md | .codemie/guides/architecture/architecture.md |
| **Testing** | Writing tests, fixing tests, coverage | "Write tests for...", "Fix failing test" | .codemie/guides/testing/testing-patterns.md | - |
| **Frontend Dev** | React components, UI, state, routing, forms | "Create component", "Add page", "Fix UI bug" | .codemie/guides/development/frontend-patterns.md | .codemie/guides/architecture/architecture.md |
| **Security** | Auth, guards, validation, token handling | "Secure endpoint", "Add auth", "Protect route" | .codemie/guides/security/security-patterns.md | .codemie/guides/api/api-patterns.md |
| **Dev Practices** | Error handling, logging, naming, config | "Add error handling", "Log this operation" | .codemie/guides/development/development-practices.md | - |

### Complexity Guide

| Level | Indicators | Action |
|-------|------------|--------|
| **Simple** | 1-2 files, clear pattern | P0 guide if unsure |
| **Medium** | 3-5 files, standard scope | Load P0 guides |
| **High** | 6+ files, architectural impact | All P0+P1 guides, consider planning mode |

---

## 🔄 EXECUTION WORKFLOW

```
START
  ├─> STEP 1: Parse Request
  │   └─ Match intent to Category → Assess complexity
  │
  ├─> STEP 2: Load Guides
  │   └─ Load P0 guides → Confidence < 80%? → Load P1 or ask user
  │
  ├─> STEP 3: Execute
  │   └─ Apply patterns from guides → Follow Critical Rules
  │
  └─> STEP 4: Validate & Deliver
      └─ Run checklist → All pass? → Deliver
```

### Pre-Delivery Checklist

- [ ] Meets user's request requirements?
- [ ] Follows patterns from loaded guides?
- [ ] Critical Rules followed? (ESM `.js` imports in API, no git/test ops unless asked)
- [ ] No hardcoded secrets or credentials?

---

## 🛠️ COMMANDS

| Task | Command | Notes |
|------|---------|-------|
| **Setup** | `pnpm install` | From repo root |
| **Run All** | `pnpm dev` | Starts API + Web concurrently |
| **Run API** | `pnpm turbo run dev --filter=@dep-incubation-dashboard/api` | Port 3000 |
| **Run Web** | `pnpm turbo run dev --filter=@dep-incubation-dashboard/web` | Port 5173 |
| **Lint** | `pnpm lint` | All apps |
| **Format** | `pnpm format` | Prettier across all files |
| **Build** | `pnpm build` | All apps |
| **Test** ⚠️ | `pnpm test` | ONLY when user requests |
| **DB Migrate** | `cd apps/api && pnpm prisma:migrate` | Run after schema changes |
| **DB Generate** | `cd apps/api && pnpm prisma:generate` | Regenerate Prisma client |
| **DB Seed** | `cd apps/api && pnpm prisma:seed` | Seed with mock data |
| **DB Studio** | `cd apps/api && pnpm prisma:studio` | Visual DB browser |
| **Storybook** | `cd apps/web && pnpm storybook` | Port 6006 |

---

## 🏗️ PROJECT CONTEXT

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | TypeScript | ~5.x |
| Backend | NestJS | 11 |
| Frontend | React | 19 |
| Build Tool | Vite | 7 |
| Monorepo | Turborepo + pnpm | latest |
| ORM | Prisma | 7 |
| Database | PostgreSQL | — |
| API Testing | Jest | 30 |
| Web Testing | Vitest | 4 |
| E2E Testing | Playwright | — |
| UI Library | shadcn/ui + Radix UI | — |
| CSS | Tailwind CSS | v4 |
| State | Zustand | v5 |
| Server State | TanStack Query | v5 |

### Project Structure

```
dep-incubation-dashboard/
├── apps/api/             NestJS REST API (src/modules/, prisma/)
├── apps/web/             React SPA (src/features/, src/components/)
├── packages/             Reserved for shared libs (empty)
├── .codemie/guides/      Architecture and pattern guides
├── turbo.json            Turborepo pipeline config
└── pnpm-workspace.yaml   Workspace definition
```

### Environment Setup

```bash
# Backend — copy and fill in values
cp apps/api/.env.example apps/api/.env

# Frontend — create with:
echo "VITE_API_BASE_URL=http://localhost:3000" > apps/web/.env
```

---

## 🔧 TROUBLESHOOTING

| Symptom | Cause | Solution |
|---------|-------|----------|
| `Cannot find module './service'` | Missing `.js` in ESM import | Add `.js` extension to relative import |
| Prisma type errors after schema change | Stale generated client | Run `cd apps/api && pnpm prisma:generate` |
| `DATABASE_URL` not found | Missing `.env` | Copy `apps/api/.env.example` → `apps/api/.env` |
| 401 on all API requests | Missing/expired JWT | Check `JWT_SECRET` env var is set |
| Pre-commit hook fails | Lint errors in staged files | Run `pnpm lint -- --fix` then re-stage |
| Turbo cache stale | Incorrect cached output | Run `pnpm turbo run <cmd> --force` |

---

## 🎯 REMEMBER

### Workflow
1. **Parse** → Match intent to Category (Task Classifier)
2. **Load** → Read P0 guides for matched categories
3. **Check** → Confidence ≥ 80%? No → load P1 or ask user
4. **Execute** → Apply patterns from guides
5. **Validate** → Checklist must pass
6. **Deliver**

### When to Ask User
- Ambiguous requirements
- Low confidence after reading guides
- Missing information (env vars, IDs, etc.)
