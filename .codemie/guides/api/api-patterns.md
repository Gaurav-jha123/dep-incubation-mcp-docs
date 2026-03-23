---
# API Patterns Guide

**Project**: dep-incubation-dashboard (API)
**Stack**: NestJS 11, TypeScript ESM, Passport JWT, class-validator
**Base URL**: `/api/v1`
**Swagger**: `/api/docs`

---

## File Structure

| Purpose | Path |
|---------|------|
| Controllers | `apps/api/src/modules/<feature>/<feature>.controller.ts` |
| Services | `apps/api/src/modules/<feature>/<feature>.service.ts` |
| DTOs / Validation | `apps/api/src/modules/<feature>/dto/` |
| Guards | `apps/api/src/modules/auth/guards/` |
| Auth endpoints | `apps/api/src/modules/auth/auth.controller.ts` |

---

## Endpoint Pattern

Full example with auth + validation + Swagger:

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.controller.ts:27
@ApiTags('Skill Matrix')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skill-matrix')
export class SkillMatrixController {
  @Patch(':id')
  @ApiOperation({ summary: 'Update a skill matrix entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Request() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillMatrixDto,
  ) {
    return this.skillMatrixService.update(req.user.id, id, dto);
  }
}
```

**To add new endpoint:**
1. Add method in `<feature>.controller.ts` with decorators
2. Implement logic in `<feature>.service.ts`
3. Create DTO in `dto/` if body/query validation needed

---

## Validation Pattern

**Library**: `class-validator` + `class-transformer`
**Applied at**: Global `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`)

```ts
// Source: apps/api/src/modules/skill-matrix/dto/create-skill-matrix.dto.ts
import { IsInt, Min, Max } from 'class-validator';
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

---

## Authentication

**Method**: JWT Bearer token
**Guard**: `JwtAuthGuard` (extends `AuthGuard('jwt')`)

```ts
// Protect an entire controller:
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('my-resource')

// Or protect a single method:
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('protected')
```

**Access user in handler:**
```ts
create(@Request() req: { user: { id: number; email: string } }, @Body() dto: CreateDto)
```

---

## Response Patterns

Auth endpoints return:
```json
{ "user": { "id": 1, "name": "John", "email": "john@example.com" }, "accessToken": "...", "refreshToken": "..." }
```

CRUD endpoints return the Prisma record directly (no envelope wrapper).

Paginated endpoints return:
```json
{ "data": [...], "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 } }
```

---

## Status Codes

| Operation | Success | Common Errors |
|-----------|---------|---------------|
| Create (POST) | 201 | 400 (validation), 401 (unauth), 409 (conflict) |
| Read (GET) | 200 | 401, 404 |
| Update (PATCH) | 200 | 400, 401, 404 |
| Delete (DELETE) | 200 | 401, 404 |

Use `@HttpCode(HttpStatus.OK)` on POST handlers that should return 200 instead of 201.

---

## Error Handling

```ts
// Source: apps/api/src/modules/auth/auth.service.ts:24
throw new ConflictException('Email already registered');
throw new UnauthorizedException('Invalid credentials');
throw new NotFoundException(`SkillMatrix with id ${id} not found`);
```

NestJS converts these automatically to `4xx` JSON responses. Never return raw error objects.

---

## Pagination

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.service.ts:19
const skip = (page - 1) * limit;
const [data, total] = await Promise.all([
  this.prisma.skillMatrix.findMany({ skip, take: limit, include, orderBy: { id: 'asc' } }),
  this.prisma.skillMatrix.count(),
]);
return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
```

**Params**: `page` (optional), `limit` (optional) — use `PaginationQueryDto`
**Behavior**: No params = return all records

---

## Conventions

| Aspect | Convention |
|--------|------------|
| Route naming | kebab-case (`skill-matrix`) |
| Module files | kebab-case (`skill-matrix.controller.ts`) |
| Async handling | async/await throughout |
| Path params | `ParseIntPipe` for numeric IDs |
| Relative imports | Always `.js` extension (ESM requirement) |

---

## Swagger Requirements (Every Controller)

- `@ApiTags('Feature Name')` on class
- `@ApiOperation({ summary })` on each method
- `@ApiResponse({ status, description })` for success + errors
- `@ApiParam()` for path params
- `@ApiBearerAuth()` on protected routes

---

## Quick Reference

| Task | Syntax | Example |
|------|--------|---------|
| Protect route | `@UseGuards(JwtAuthGuard)` | `auth.controller.ts:55` |
| Parse int param | `@Param('id', ParseIntPipe) id: number` | `skill-matrix.controller.ts:50` |
| Get current user | `@Request() req: { user: { id: number } }` | `skill-matrix.controller.ts:63` |
| Query params DTO | `@Query() query: PaginationQueryDto` | `skill-matrix.controller.ts:41` |
| Return 200 on POST | `@HttpCode(HttpStatus.OK)` | `auth.controller.ts:37` |
