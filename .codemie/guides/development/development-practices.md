---
# Development Practices

**Project**: dep-incubation-dashboard
**Language**: TypeScript (strict) | **Runtimes**: Node.js ≥ 22 (API), Browser (Web)
**Linter**: ESLint 9 | **Formatter**: Prettier | **Package Manager**: pnpm

---

## Code Style

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files (API) | kebab-case | `skill-matrix.service.ts` |
| Files (Web components) | PascalCase | `Button.tsx`, `SkillMatrix.tsx` |
| Files (Web hooks/utils) | camelCase | `use-auth-store.ts`, `create-unique-id.ts` |
| Classes / Components | PascalCase | `AuthService`, `SkillMatrixController` |
| Functions / Methods | camelCase | `findAll`, `createUser`, `useAuthMutation` |
| Interfaces | Prefix `I` (web only) | `IUser`, `IAuthStore` |
| Constants | UPPER_SNAKE_CASE | `APP_ROUTES` |
| React component files | PascalCase with folder | `components/atoms/Button/Button.tsx` |

### API File Organization

```ts
// Standard NestJS service structure:
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js'; // .js extension required

@Injectable()
export class FeatureService {
  constructor(private readonly prisma: PrismaService) {}
  // methods...
}
```

**ESM Import Rule**: All relative imports in `apps/api/` MUST use `.js` extension.

---

## Code Quality

### Commands

| Action | Command | Auto-fix |
|--------|---------|----------|
| Lint (API) | `cd apps/api && pnpm lint` | `pnpm lint -- --fix` |
| Lint (Web) | `cd apps/web && pnpm lint` | `pnpm lint -- --fix` |
| Format all | `pnpm format` (root) | Writes in-place |
| Lint all | `pnpm lint` (root) | — |

### Configuration Files

| Tool | Config File |
|------|-------------|
| ESLint | `apps/api/eslint.config.mjs`, `apps/web/eslint.config.js` |
| Prettier | Root `prettier.config.mjs` or `.prettierrc` |
| TypeScript | `apps/api/tsconfig.json`, `apps/web/tsconfig.json` |

### Pre-commit Hooks (Husky + lint-staged)

**Runs on commit**: ESLint `--fix` on staged files in `apps/web/**` and `apps/api/**`
**Runs on push**: Build check via Turborepo

Commit messages are enforced: **Conventional Commits** (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`)

---

## Error Handling (Backend)

### Exception Types

| Exception | Use When |
|-----------|----------|
| `NotFoundException` | Resource doesn't exist |
| `ConflictException` | Duplicate / state conflict |
| `UnauthorizedException` | Auth required or failed |
| `BadRequestException` | Input validation failure (auto by ValidationPipe) |

```ts
// Source: apps/api/src/modules/auth/auth.service.ts:25
if (existing) throw new ConflictException('Email already registered');
if (!user) throw new UnauthorizedException('Invalid credentials');
if (!record) throw new NotFoundException(`SkillMatrix with id ${id} not found`);
```

**Rules:**
- Throw NestJS built-in exceptions — never raw `Error`
- Let the global `ValidationPipe` handle DTO validation errors automatically
- ❌ Never catch-and-ignore silently

---

## Logging (Backend)

```ts
// Source: apps/api/src/prisma/prisma.service.ts:16
private readonly logger = new Logger(PrismaService.name);
this.logger.log('Database connected');
```

Use NestJS built-in `Logger` class. Instantiate with `new Logger(ClassName.name)`.

| Level | Method | Use For |
|-------|--------|---------|
| Info | `this.logger.log()` | Startup, significant operations |
| Warning | `this.logger.warn()` | Recoverable issues |
| Error | `this.logger.error()` | Failures requiring attention |
| Debug | `this.logger.debug()` | Development troubleshooting |

---

## Configuration & Environment

### Backend — access via `ConfigService`

```ts
// In constructor DI:
constructor(private readonly configService: ConfigService) {}

// Access:
configService.get<string>('DATABASE_URL')!
configService.get<number>('PORT', 3000)
```

### Frontend — Vite env vars

```ts
const base = import.meta.env.VITE_API_BASE_URL as string;
```

All frontend env vars must be prefixed `VITE_`.

### Required Variables

| Variable | App | Purpose |
|----------|-----|---------|
| `DATABASE_URL` | API | PostgreSQL connection string |
| `JWT_SECRET` | API | Token signing |
| `PORT` | API | Server port (default: 3000) |
| `NODE_ENV` | API | Environment |
| `VITE_API_BASE_URL` | Web | Backend base URL |

---

## Dependencies

```bash
# API — add production dependency
cd apps/api && pnpm add <package>

# API — add dev dependency
cd apps/api && pnpm add -D <package>

# Web
cd apps/web && pnpm add <package>

# Root (shared dev tools)
pnpm add -D -w <package>
```

Always commit `pnpm-lock.yaml`.

---

## Don't Do

| ❌ Avoid | ✅ Instead | Why |
|----------|-----------|-----|
| `import './service'` (no ext) | `import './service.js'` | ESM requirement in API |
| `new PrismaClient()` | Inject `PrismaService` | Breaks connection management |
| Catch and ignore errors silently | Throw appropriate NestJS exception | Hides bugs |
| String interpolation in queries | Prisma ORM operations | SQL injection risk |
| Hardcode env values | `ConfigService.get()` / `import.meta.env` | Security |

---

## Quick Reference

| Need | Location |
|------|----------|
| ESLint config (API) | `apps/api/eslint.config.mjs` |
| ESLint config (Web) | `apps/web/eslint.config.js` |
| Husky hooks | `.husky/` |
| lint-staged config | Root `package.json` |
| NestJS exceptions | `@nestjs/common` |
| Logger | `@nestjs/common` → `new Logger(ClassName.name)` |
