---
# Testing Patterns

**Project**: dep-incubation-dashboard
**API Framework**: Jest 30 + Supertest (NestJS testing module)
**Web Framework**: Vitest 4 + React Testing Library + Playwright (e2e)
**Test Locations**: `apps/api/src/**/*.spec.ts` | `apps/web/src/**/*.test.{ts,tsx}`

---

## Test Organization

```
apps/api/src/
├── **/*.spec.ts            Unit tests (co-located with source)
└── test/jest-e2e.json      e2e config

apps/web/src/
├── components/atoms/       *.test.tsx per component
├── components/molecules/   *.test.tsx per component
├── components/organisms/   *.test.tsx per component
├── features/               *.test.tsx per feature
├── store/                  *.test.ts per store
└── layout/__tests__/       Layout tests
```

### Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| API test files | `*.spec.ts` | `auth.service.spec.ts` |
| Web test files | `*.test.tsx` / `*.test.ts` | `Button.test.tsx` |
| Describe blocks | Component/class name | `describe('AuthService', ...)` |
| Test names | `should <expectation>` | `it('should create user and return tokens')` |

---

## Running Tests

### API (Jest)

| Action | Command |
|--------|---------|
| All tests | `cd apps/api && pnpm test` |
| Watch mode | `cd apps/api && pnpm test -- --watch` |
| Single file | `cd apps/api && pnpm test -- auth.service` |
| With coverage | `cd apps/api && pnpm test:cov` |
| E2E tests | `cd apps/api && pnpm test:e2e` |

### Web (Vitest)

| Action | Command |
|--------|---------|
| Watch mode | `cd apps/web && pnpm test` |
| Single run | `cd apps/web && pnpm test:ci` |
| Single file | `cd apps/web && pnpm test:ci Button` |
| With coverage | `cd apps/web && pnpm test:coverage` |
| E2E (Playwright) | `cd apps/web && pnpm test:e2e` |
| E2E with UI | `cd apps/web && pnpm test:e2e:ui` |

---

## API Unit Test Pattern (Jest + NestJS Testing Module)

```ts
// Source: apps/api/src/modules/auth/auth.service.spec.ts:1
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

const mockPrismaService = { user: { findUnique: jest.fn(), create: jest.fn() } };
const mockJwtService = { signAsync: jest.fn(), verifyAsync: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should throw ConflictException if email already exists', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 1, email: 'x@x.com' });
    await expect(service.signup(dto)).rejects.toThrow(ConflictException);
  });
});
```

### Mocking Pattern (API)

- Always inject mock objects via `{ provide: Service, useValue: mockObject }`
- Call `jest.clearAllMocks()` in `beforeEach`
- Use `mockResolvedValue` / `mockRejectedValue` for async operations

---

## Web Component Test Pattern (Vitest + React Testing Library)

```ts
// Source: apps/web/src/components/atoms/Button/Button.test.tsx:1
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

afterEach(() => { cleanup(); });

describe("Button Component", () => {
  it("renders button", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).not.toBeNull();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Structure

```ts
// Arrange - render component with props
render(<Component prop="value" />);
// Act - interact
fireEvent.click(screen.getByRole("button"));
// Assert - verify
expect(screen.getByText("Expected")).not.toBeNull();
```

---

## Parameterized Tests (Web)

```ts
// Source: apps/web/src/components/atoms/Button/Button.test.tsx:25
it.each([
  ["primary", ["bg-primary-500", "text-neutral-900"]],
  ["secondary", ["border-neutral-200", "bg-neutral-50"]],
] as const)("applies %s variant classes", (variant, expectedClasses) => {
  render(<Button variant={variant}>Variant</Button>);
  expectedClasses.forEach((cls) => expect(screen.getByRole("button").className.includes(cls)).toBe(true));
});
```

---

## Mocking (Web — Vitest)

```ts
const handleClick = vi.fn();              // spy
vi.spyOn(module, 'fn').mockReturnValue(); // module spy
vi.mock('@/services/api/auth.api');       // module mock
```

---

## Writing New Tests Checklist

**API (NestJS):**
1. Create `<feature>.service.spec.ts` or `<feature>.controller.spec.ts` co-located
2. Use `Test.createTestingModule` with mocked dependencies
3. Test happy path + error cases
4. Run: `cd apps/api && pnpm test -- <filename>`

**Web (React):**
1. Create `<Component>.test.tsx` co-located with component
2. Import from vitest: `describe, it, expect, vi, afterEach`
3. Call `cleanup()` in `afterEach`
4. Run: `cd apps/web && pnpm test:ci <ComponentName>`

---

## Common Patterns

| Pattern | When to Use | Source |
|---------|-------------|--------|
| `afterEach(() => cleanup())` | All web component tests | `Button.test.tsx:6` |
| `jest.clearAllMocks()` in `beforeEach` | All API service tests | `auth.service.spec.ts:34` |
| `mockResolvedValue(null)` | Simulate no DB result | `auth.service.spec.ts:45` |
| `rejects.toThrow(ExceptionClass)` | Test error cases | `auth.service.spec.ts:100` |
| `screen.getByRole("button")` | Query by semantic role | `Button.test.tsx:13` |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Jest ESM error | Tests use `--experimental-vm-modules` (configured in `package.json`) |
| Stale DOM between tests | Ensure `afterEach(() => cleanup())` in web tests |
| Mock not applied | Verify `jest.clearAllMocks()` in `beforeEach`; check mock path |
| `screen.getByText` fails | Check for async rendering — use `waitFor` if needed |
