# API Backend

NestJS REST API for DEP Incubation Dashboard.

## Stack
- NestJS 11
- Prisma 7 ORM
- PostgreSQL
- JWT authentication

## Getting Started

**1. Start the server**

From repo root:

```bash
pnpm dev:api
```

Server runs at: http://localhost:3000

**2. Setup environment**

Copy the example file:

```bash
cp apps/api/.env.example apps/api/.env
```

Required values in `.env`:

| Variable | What it is | Example |
|----------|-----------|---------|
| `DATABASE_URL` | Database connection | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens | Any random string: `my-secret-key-123` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

**3. Setup database**

For **local development database**:

```bash
cd apps/api
pnpm prisma:migrate   # Run pending migrations
pnpm prisma:generate  # Regenerate Prisma client
pnpm prisma:seed      # (Optional) Load test data
```

## API Endpoints

All routes are under `/api/v1`

**Projects:**
- `GET /projects` — List all projects
- `GET /projects/:id` — Get project details
- `POST /projects` — Create project
- `PATCH /projects/:id` — Update project
- `DELETE /projects/:id` — Delete project

**Project Assignments:**
- `POST /projects/:id/assignments` — Assign user to project
- `DELETE /projects/:id/assignments/:userId` — Remove user from project
- `PATCH /projects/:id/assignments/:userId` — Update assignment status

**Swagger docs:** http://localhost:3000/api/docs

## Database Basics

**After pulling code with schema changes:**

```bash
pnpm install
cd apps/api
pnpm prisma:generate   # Always do this
```

Then, depending on your database setup:

**If using local database:**
```bash
pnpm prisma:migrate
```

**If using shared database (UAT, dev, etc.):**
```bash
npx prisma migrate deploy
```

**Check migration status:**
```bash
npx prisma migrate status
```

## Build & Production

```bash
pnpm build            # Build the app
pnpm start:prod       # Run built version
```

## Troubleshooting

**Error: "Cannot find module" or type errors**
```bash
pnpm prisma:generate
```

**Database connection failed**
- Check `DATABASE_URL` in `.env`
- Make sure PostgreSQL is running

**Migrations won't apply**
```bash
npx prisma migrate status       # See what's pending
npx prisma migrate deploy       # Apply pending migrations to shared DB
```

For more info, see the schema: [prisma/schema.prisma](prisma/schema.prisma)