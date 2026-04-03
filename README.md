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
