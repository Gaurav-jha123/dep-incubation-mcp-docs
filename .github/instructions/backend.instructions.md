---
description: "Use when writing or modifying NestJS backend code — controllers, services, modules, DTOs, guards, Prisma queries. Covers module patterns, Swagger docs, auth guards, ESM imports."
applyTo: "apps/api/src/**"
---
# Backend Conventions (NestJS + Prisma)

## Commands

```bash
cd apps/api
pnpm prisma:generate      # regenerate Prisma client
pnpm prisma:migrate       # run migrations
pnpm prisma:studio        # open Prisma Studio
pnpm test                 # jest (--experimental-vm-modules)
pnpm test:e2e             # e2e with supertest
```

## Module Structure

Every feature module follows this layout:

```
src/modules/<feature>/
  <feature>.module.ts        # Module definition
  <feature>.controller.ts    # Route handlers with Swagger decorators
  <feature>.service.ts       # Business logic using PrismaService
  dto/
    create-<feature>.dto.ts  # class-validator decorators
    update-<feature>.dto.ts  # optional fields variant
```

## ESM Imports

Always use `.js` extension in relative imports — this is required for NestJS ESM:

```ts
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
```

## Prisma

- Use `PrismaService` (globally provided via `PrismaModule`) — never instantiate `PrismaClient` directly
- Generated client lives at `src/generated/prisma/` — import from `../../generated/prisma/client.js`
- All models use `@@map()` for snake_case table names and `@map()` for snake_case columns

## DTOs

Use `class-validator` + `@nestjs/swagger` decorators:

```ts
import { IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillMatrixDto {
  @ApiProperty({ example: 1, description: 'Topic ID' })
  @IsInt()
  topicId!: number;

  @ApiProperty({ example: 75, description: 'Skill level (0-100)' })
  @IsInt() @Min(0) @Max(100)
  value!: number;
}
```

## Auth & Guards

- Protected routes: `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()`
- JWT payload shape: `{ id: number, email: string, type: 'access' | 'refresh' }`
- Access user in controllers via `@Request() req: { user: { id: number; email: string } }`

## Swagger

Every controller must have:

- `@ApiTags('Feature Name')` at class level
- `@ApiOperation({ summary })` on each method
- `@ApiResponse({ status, description })` for success and error cases
- `@ApiParam()` for path parameters

## Error Handling

Use NestJS built-in exceptions:

```ts
throw new NotFoundException(`User with id ${id} not found`);
throw new ConflictException('Email already registered');
throw new UnauthorizedException('Invalid credentials');
```

## Pagination

Reuse `PaginationQueryDto` — supports optional `page` and `limit` query params. Return paginated shape:

```ts
{ data: T[], meta: { total, page, limit, totalPages } }
```

## Database Models

Three models in `prisma/schema.prisma`:
- **User** — `id`, `name`, `email` (unique), `password` (bcrypt-hashed)
- **Topic** — `id`, `label`, `description?`
- **SkillMatrix** — junction: `userId`, `topicId`, `value` (0-100), unique on `[userId, topicId]`
