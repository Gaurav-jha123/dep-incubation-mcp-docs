# DEP Incubation Dashboard

A full-stack monorepo powered by **Turborepo**, containing a React frontend and a NestJS backend.

## Monorepo Structure

```
├── apps/
│   ├── web/            → React + Vite + TypeScript frontend
│   └── api/            → NestJS + Prisma + PostgreSQL backend
├── packages/           → Shared libraries (future use)
├── turbo.json          → Turborepo pipeline configuration
├── pnpm-workspace.yaml → pnpm workspace definition
└── package.json        → Root scripts & shared devDependencies
```

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

The backend uses Prisma with PostgreSQL. Three core tables:

### `users`

| Column     | Type      | Constraints              |
| ---------- | --------- | ------------------------ |
| id         | INT       | Primary Key, Auto-inc    |
| name       | STRING    | Not Null                 |
| email      | STRING    | Not Null, Unique         |
| password   | STRING    | Not Null (hashed)        |
| created_at | TIMESTAMP | Default: now()           |
| updated_at | TIMESTAMP | Auto-updated on mutation |

### `topics`

| Column      | Type      | Constraints              |
| ----------- | --------- | ------------------------ |
| id          | INT       | Primary Key, Auto-inc    |
| name        | STRING    | Not Null                 |
| description | TEXT      | Nullable                 |
| created_at  | TIMESTAMP | Default: now()           |
| updated_at  | TIMESTAMP | Auto-updated on mutation |

### `skill_matrix`

| Column      | Type      | Constraints                           |
| ----------- | --------- | ------------------------------------- |
| id          | INT       | Primary Key, Auto-inc                 |
| user_id     | INT       | Foreign Key → users.id, Not Null      |
| topic_id    | INT       | Foreign Key → topics.id, Not Null     |
| skill_level | INTEGER   | Not Null (1–5 proficiency scale)      |
| created_at  | TIMESTAMP | Default: now()                        |
| updated_at  | TIMESTAMP | Auto-updated on mutation              |

### Relationships

- **users ↔ skill_matrix** — One-to-Many (a user can have multiple skill entries)
- **topics ↔ skill_matrix** — One-to-Many (a topic can appear in multiple skill entries)
- **users ↔ topics** — Many-to-Many (linked through `skill_matrix` as a junction table)

## Project Conventions

- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by Commitlint + Husky
- **Branching**: Feature branches off `dev`
- **Linting**: Runs automatically on pre-commit via lint-staged
- **Build check**: Runs on pre-push
