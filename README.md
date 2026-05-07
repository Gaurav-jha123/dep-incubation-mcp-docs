# DEP Incubation Dashboard

A full-stack monorepo powered by **Turborepo**, containing a React frontend and a NestJS backend.

## Monorepo Structure

```
dep-incubation-dashboard/
├── apps/
│   ├── api/                  NestJS REST API
│   │   ├── src/modules/      Feature modules (auth, users, projects, …)
│   │   └── prisma/           Schema, migrations, seed
│   └── web/                  React SPA
│       ├── src/features/     Feature slices (auth, dashboard, projects, …)
│       └── src/components/   Shared UI components
├── packages/                 Shared libraries (reserved)
├── .codemie/                 Architecture and pattern guides
├── .github/                  Copilot and agent customization
└── turbo.json                Turborepo pipeline config
```

## Deployed Environments

### UAT
| Service | URL |
|---------|-----|
| Web | https://uat-dep-incubation-dashboard-vercel.vercel.app |
| API | https://uat-dep-incubation-backend.vercel.app |
| Swagger | https://uat-dep-incubation-backend.vercel.app/api/docs |

### Production
| Service | URL |
|---------|-----|
| Web | https://dep-incubation-dashboard.vercel.app |
| API | https://dep-incubation-backend.vercel.app |
| Swagger | https://dep-incubation-backend.vercel.app/api/docs |

## Documentation

- Backend guide: [apps/api/README.md](apps/api/README.md)
- Frontend guide: [apps/web/README.md](apps/web/README.md)

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React 19, Vite, TypeScript, Tailwind CSS    |
| Backend    | NestJS, Prisma ORM, PostgreSQL              |
| Monorepo   | Turborepo, pnpm workspaces                  |
| Testing    | Vitest, Playwright (web) · Jest (api)       |
| Storybook  | Storybook 10 (web)                          |
| Linting    | ESLint, Prettier, Commitlint, Husky         |

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** ≥ 10
- **PostgreSQL** running locally or remotely

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

**Frontend** — `apps/web/.env`

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Backend** — `apps/api/.env` (copy from `.env.example`)

```bash
cp apps/api/.env.example apps/api/.env
```

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dashboard_app?schema=public"
PORT=3000
NODE_ENV=development
```

### 3. Set up the database

```bash
cd apps/api
pnpm prisma:migrate   # Run migrations
pnpm prisma:generate  # Generate Prisma Client
```

### 4. Start development

```bash
# Run both frontend & backend in parallel
pnpm dev

# Or run individually
pnpm turbo run dev --filter=@dep-incubation-dashboard/web
pnpm turbo run dev --filter=@dep-incubation-dashboard/api
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Prisma Studio**: `cd apps/api && pnpm prisma:studio`

## Scripts

All root-level scripts are orchestrated by Turborepo:

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `pnpm dev`             | Start all apps in development mode       |
| `pnpm build`           | Build all apps                           |
| `pnpm lint`            | Lint all apps                            |
| `pnpm test`            | Run tests across all apps                |
| `pnpm format`          | Format all files with Prettier           |

### App-specific scripts

Filter to a specific workspace using `--filter`:

```bash
pnpm turbo run <script> --filter=@dep-incubation-dashboard/web
pnpm turbo run <script> --filter=@dep-incubation-dashboard/api
```

## Database Schema

The backend uses **Prisma ORM** with PostgreSQL. For the complete schema definition, see [apps/api/prisma/schema.prisma](apps/api/prisma/schema.prisma).

**Core models:** User, Topic, Project, ProjectAssignment, SkillMatrix, SubTopic

## Project Conventions

- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by [commitlint.config.js](commitlint.config.js) + [.husky](.husky) git hooks
- **Branching**: Feature branches off `dev`
- **Linting**: Runs automatically on pre-commit via lint-staged
- **Build check**: Runs on pre-push

---

## AI Developer Tooling — MCP Doc Server

This repo ships a live **Model Context Protocol (MCP) server** that gives AI agents (GitHub Copilot, Claude Code) instant access to structured API documentation without reading raw source files.

**Live endpoint:** `https://dep-incubation-mcp-docs.vercel.app`

### How it works for you as a developer

When you open this repo in VS Code, Copilot automatically discovers the MCP server via [.vscode/mcp.json](.vscode/mcp.json). From that point, any Copilot agent session can query the server instead of reading source files.

#### Scenario 1 — "How do I call the login endpoint?"

Without MCP, Copilot reads `auth.controller.ts` + `login.dto.ts` + `auth.service.ts` (~1,400 tokens, multiple file reads).

With MCP, Copilot makes two calls:

```
search_docs("auth login")
→ auth__login__POST  (score 61)
→ auth__signup__POST (score 52)
→ auth__logout__POST (score 50)

get_doc("auth__login__POST")
→ ## POST /auth/login
   Request: { email: string (body), password: string (body) }
   Response: Login successful
   Auth: public endpoint — no guard required
   Errors: 401 UnauthorizedException
```

**~350 tokens total. Structured. No ambiguity.**

#### Scenario 2 — "Who can assign users to a project?"

```
search_docs("assign user project")
→ projects__id_assignments__POST  (score 102) ← top hit

get_doc("projects__id_assignments__POST")
→ ## POST /projects/:id/assignments
   Auth: JwtAuthGuard + RolesGuard — requires ADMIN or MANAGER
   Request body: { userId: number, startDate?: string, endDate?: string }
   Errors: 404 Project not found, 409 ConflictException
   Execution: assignUser() → projectAssignment.create, project.findUnique, topic.findMany
```

The agent immediately knows the role requirement, DTO shape, and error conditions — without reading a single source file.

### Available tools

| Tool | Input | Returns |
|------|-------|---------|
| `search_docs` | `{ query: string }` | Top 5 matching endpoints with relevance scores |
| `get_doc` | `{ chunkId: string }` | Full structured markdown doc for one endpoint |
| `list_modules` | none | All modules and their endpoint IDs |
| `get_schema` | `{ modelName: string }` | Prisma model fields and relations |
| `get_impact` | `{ modelName: string }` | Which endpoints are affected by a model change |
| `report_issue` | `{ chunkId, issue }` | Flag a doc as inaccurate (saved to `.docs/feedback.jsonl`) |

### Keeping docs up to date

Docs regenerate automatically. When a push lands on `main`:

1. GitHub Action runs `pnpm --filter doc-indexer update`
2. Only endpoints whose source files changed get re-indexed (fingerprint check)
3. Updated `.docs/` is committed back with `[skip ci]`
4. Vercel picks up the new commit and redeploys in ~30s

Zero manual steps for developers after the initial setup.

### Manual re-index (if needed)

```bash
# Regenerate all docs from scratch
GROQ_API_KEY=<key> pnpm --filter doc-indexer index

# Regenerate only changed docs (same as CI)
GROQ_API_KEY=<key> pnpm --filter doc-indexer update
```
