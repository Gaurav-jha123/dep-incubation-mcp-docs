---
# Database Patterns

**Project**: dep-incubation-dashboard (API)
**Database**: PostgreSQL
**Data Access**: Prisma ORM v7 with `@prisma/adapter-pg` (native `pg` driver)
**Models Location**: `apps/api/prisma/schema.prisma`
**Generated Client**: `apps/api/src/generated/prisma/` (committed to repo)

---

## Connection Setup

```ts
// Source: apps/api/src/prisma/prisma.service.ts:1
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const adapter = new PrismaPg({ connectionString: configService.get<string>('DATABASE_URL')! });
    super({ adapter });
  }
}
```

**Environment Variable**: `DATABASE_URL` — full PostgreSQL connection string
(e.g., `postgresql://postgres:postgres@localhost:5432/dashboard_app?schema=public`)

---

## Data Access Pattern

**Pattern**: Service Layer — `PrismaService` injected into services, no repository abstraction

`PrismaService` is `@Global()` — inject directly without importing `PrismaModule`:

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.service.ts:8
@Injectable()
export class SkillMatrixService {
  constructor(private readonly prisma: PrismaService) {}
}
```

**To add new data access:**
1. Add service method in `<feature>.service.ts`
2. Use `this.prisma.<Model>.<operation>()`
3. Import from `../../generated/prisma/client.js` if types needed

---

## Models

Three models in `prisma/schema.prisma`:

| Model | Table | Key Fields |
|-------|-------|------------|
| `User` | `users` | `id`, `name`, `email` (unique), `password` (bcrypt) |
| `Topic` | `topics` | `id`, `label`, `description?` |
| `SkillMatrix` | `skill_matrix` | `id`, `userId` FK, `topicId` FK, `value` (0–100) |

All models use `@@map()` for snake_case table names and `@map()` for snake_case columns.

```
User ──1:N──► SkillMatrix ◄──N:1── Topic
```

Unique constraint on `[userId, topicId]`. Cascade deletes on both FKs.

---

## Query Patterns

### Basic Operations

| Operation | Pattern | Source |
|-----------|---------|--------|
| Find by ID | `this.prisma.model.findUnique({ where: { id } })` | `skill-matrix.service.ts:50` |
| Find many | `this.prisma.model.findMany({ include, orderBy })` | `skill-matrix.service.ts:43` |
| Create | `this.prisma.model.create({ data: dto, include })` | `skill-matrix.service.ts:66` |
| Update | `this.prisma.model.update({ where: { id }, data: dto })` | `skill-matrix.service.ts:82` |
| Delete | `this.prisma.model.delete({ where: { id } })` | `skill-matrix.service.ts:95` |

### Eager Loading (include)

Always include relations in the query — never make separate calls:

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.service.ts:14
const include = {
  user: { select: { id: true, name: true, email: true } },
  topic: { select: { id: true, label: true } },
};
```

### Pagination

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.service.ts:19
const skip = (page - 1) * limit;
const [data, total] = await Promise.all([
  this.prisma.skillMatrix.findMany({ skip, take: limit, include, orderBy: { id: 'asc' } }),
  this.prisma.skillMatrix.count(),
]);
```

---

## Migrations

| Action | Command |
|--------|---------|
| Run pending migrations | `cd apps/api && pnpm prisma:migrate` |
| Generate Prisma client | `cd apps/api && pnpm prisma:generate` |
| Open Prisma Studio | `cd apps/api && pnpm prisma:studio` |
| Seed database | `cd apps/api && pnpm prisma:seed` |

**Migrations location**: `apps/api/prisma/migrations/`
**Naming convention**: `{timestamp}_{description}` (e.g., `20260319092240_base`)

**After any schema change**: run `prisma:migrate` then `prisma:generate` to update the committed client.

---

## Seeding

**Seeds location**: `apps/api/prisma/seed.ts`
**Script**: uses `upsert` to be idempotent — safe to run multiple times
**Data**: 15 users, 20 topics, full cross-product of skill matrix entries (0–100 random values)

---

## Error Handling

| Error Type | Handling |
|------------|----------|
| Not found | Check result, throw `NotFoundException` from service |
| Duplicate key (unique constraint) | Catch in service, throw `ConflictException` |

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.service.ts:57
if (!record) throw new NotFoundException(`SkillMatrix with id ${id} not found`);
```

---

## Conventions Summary

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use `PrismaService` via DI | Instantiate `PrismaClient` directly |
| `include` relations in same query | Fetch related data in separate queries |
| Use `select` to limit fields returned | Return full models with sensitive fields |
| Run migrate + generate after schema change | Commit without regenerating client |
| Import from `../../generated/prisma/client.js` | Use `@prisma/client` import path |

---

## Quick Reference

| Need | Location |
|------|----------|
| Prisma schema | `apps/api/prisma/schema.prisma` |
| Generated client | `apps/api/src/generated/prisma/` |
| PrismaService | `apps/api/src/prisma/prisma.service.ts` |
| Migrations | `apps/api/prisma/migrations/` |
| Seed script | `apps/api/prisma/seed.ts` |
| Prisma config | `apps/api/prisma.config.ts` |
