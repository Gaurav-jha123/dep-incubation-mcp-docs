---
# Security Practices

**Project**: dep-incubation-dashboard
**Auth Method**: JWT (stateless — access + refresh tokens)
**Auth Library**: `@nestjs/passport` + `passport-jwt` + `@nestjs/jwt`

---

## Authentication Flow

```
Request → JwtAuthGuard → JwtStrategy (validates Bearer token)
              │
              ▼ (failure)
         401 Unauthorized

Refresh flow (frontend):
  apiClient gets 401 → POST /api/v1/auth/refresh (httpOnly cookie)
    → new accessToken → retry original request
    → on refresh fail → clearUserDetails() → redirect /login
```

### Token Details

| Aspect | Value |
|--------|-------|
| Type | JWT (signed with `JWT_SECRET`) |
| Access token storage | Zustand memory (never persisted) |
| Refresh token storage | httpOnly cookie (`credentials: "include"`) |
| Access token expiry | 15 minutes |
| Refresh token expiry | 7 days |
| Refresh persistence | Stateless — no DB storage |
| JWT payload | `{ id: number, email: string, type: 'access' \| 'refresh' }` |

### Protect a Route

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.controller.ts:27
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skill-matrix')
export class SkillMatrixController { ... }

// Or per-method:
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('me')
async getProfile(...) {}
```

---

## Authorization

**Type**: User-scoped resource ownership (no RBAC)

Users can only modify their own records. The `userId` from the JWT payload is used as the ownership filter:

```ts
// Source: apps/api/src/modules/skill-matrix/skill-matrix.service.ts:79
async update(userId: number, id: number, dto: UpdateSkillMatrixDto) {
  return this.prisma.skillMatrix.update({ where: { id, userId }, data: dto, ... });
}
```

---

## Input Validation

**Library**: `class-validator` + `class-transformer`
**Applied at**: Global `ValidationPipe` (configured in `apps/api/src/main.ts`)

```ts
// Global ValidationPipe config — Source: apps/api/src/main.ts:22
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Strip unknown properties
  forbidNonWhitelisted: true, // Throw on unknown properties
  transform: true,           // Auto-transform types (string → number)
}));
```

```ts
// DTO validation example:
@IsInt() @Min(0) @Max(100)
value!: number;
```

**Rules:**
- ✅ All controller body/query params must be typed DTOs with `class-validator` decorators
- ❌ Never accept raw `any` types at API boundaries

---

## Secrets Management

```ts
// Source: apps/api/src/prisma/prisma.service.ts:19
configService.get<string>('DATABASE_URL')!
```

| Variable | Purpose | Required |
|----------|---------|----------|
| `JWT_SECRET` | Token signing key | Yes |
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `NODE_ENV` | Environment flag | Yes |

- ✅ Always access via `ConfigService.get()`
- ❌ Never hardcode in source
- ❌ Never commit `.env` files (`.env` is gitignored)
- ❌ Never log secret values

---

## Security Middleware

| Protection | Implementation | Source |
|------------|----------------|--------|
| CORS | `app.enableCors({ origin: true, credentials: true })` | `main.ts:54` |
| Input stripping | `whitelist: true` in ValidationPipe | `main.ts:24` |
| SQL injection | Prisma ORM (parameterized queries only) | All services |

---

## Password Security

```ts
// Source: apps/api/src/modules/auth/auth.service.ts:28
const hashedPassword = await bcrypt.hash(dto.password, 10);
// ...
const passwordValid = await bcrypt.compare(dto.password, user.password);
```

- Passwords hashed with bcrypt (salt rounds: 10)
- Raw passwords never stored or logged
- Response objects always exclude `password` field (use `select`)

---

## Frontend Token Security

```ts
// Source: apps/web/src/store/use-auth-store/use-auth-store.ts:44
partialize: (state) => ({
  user: state.user,
  isLoggedIn: state.isLoggedIn,
  // accessToken intentionally excluded — never persisted
})
```

- `accessToken` is memory-only (lost on page refresh, re-obtained via cookie)
- Refresh token flows via httpOnly cookie (`credentials: "include"`) — not accessible to JavaScript

---

## SQL Injection Prevention

**Protection**: Prisma ORM — all queries are parameterized by default.

```ts
// ✅ Safe — Prisma parameterizes automatically:
this.prisma.user.findUnique({ where: { email: dto.email } })

// ❌ NEVER — raw string interpolation:
// prisma.$queryRaw`SELECT * FROM users WHERE email = '${dto.email}'`
```

If `$queryRaw` is needed, always use tagged template literal (auto-parameterized), never string concatenation.

---

## Security Anti-Patterns

| ❌ NEVER | ✅ INSTEAD | Risk |
|----------|-----------|------|
| Return `password` field from user queries | Use `select` to exclude it | Data exposure |
| Store `accessToken` in localStorage | Keep in memory only | XSS token theft |
| Use `type: 'access'` token as refresh | Check `payload.type === 'refresh'` | Token misuse |
| Catch auth errors and continue silently | Throw `UnauthorizedException` | Auth bypass |
| Log JWT tokens or passwords | Log user IDs only | Data leakage |

---

## Quick Reference

| Security Need | Location |
|---------------|----------|
| JWT guard | `apps/api/src/modules/auth/guards/jwt-auth.guard.ts` |
| JWT strategy | `apps/api/src/modules/auth/strategies/jwt.strategy.ts` |
| ValidationPipe config | `apps/api/src/main.ts:22` |
| Auth service (token gen) | `apps/api/src/modules/auth/auth.service.ts:82` |
| Frontend token refresh | `apps/web/src/services/api/client.ts:40` |
| Auth store (no persist) | `apps/web/src/store/use-auth-store/use-auth-store.ts:44` |
