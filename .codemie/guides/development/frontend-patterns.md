---
# Frontend Patterns Guide

**Project**: dep-incubation-dashboard (Web)
**Stack**: React 19, Vite 7, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query v5, Zustand v5

---

## Component Hierarchy

| Layer | Location | Purpose |
|-------|----------|---------|
| atoms | `src/components/atoms/` | Basic UI (Button, Input, Badge, Loader...) |
| molecules | `src/components/molecules/` | Composed units (Card, Alert, Toast...) |
| organisms | `src/components/organisms/` | Complex UI (Table, Modal, Pagination...) |
| ui | `src/components/ui/` | shadcn/ui generated (use `npx shadcn add <component>`) |
| features | `src/features/` | Page-level feature modules |
| layout | `src/layout/` | App shell (Sidebar, Header, Footer) |

**Rule**: features compose organisms/molecules; organisms compose molecules/atoms; no reverse deps.

---

## Component File Structure

Each component lives in its own folder:
```
src/components/atoms/Button/
├── Button.tsx          Component
├── Button.test.tsx     Tests
└── Button.stories.tsx  Storybook (optional)
```

---

## Styling

Use `cn()` for all conditional class merging (clsx + tailwind-merge):

```ts
// Source: apps/web/src/lib/utils.ts
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

Tailwind CSS v4 is configured via `@tailwindcss/vite` plugin — no `tailwind.config.ts` directives needed.
Color tokens and design system are documented in `src/components/ColorPalette/`.

---

## Path Alias

Use `@/` for all imports from `src/`:

```ts
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";
import { apiClient } from "@/services/api/client";
import { cn } from "@/lib/utils";
```

---

## Server State — TanStack Query

All API data fetching uses TanStack Query v5. API functions are in `src/services/api/`.

```ts
// Mutation example — Source: apps/web/src/services/hooks/mutations/useAuthMutation.ts:13
const loginMutation = useMutation({
  mutationFn: loginPost,
  onSuccess: (data: ILoginResponse) => {
    const { accessToken, user } = data.data;
    setUserDetails({ ...user, token: accessToken });
    queryClient.invalidateQueries({ queryKey: ["me"] });
    navigate("/dashboard");
  },
});
```

- Mutations: `useMutation` in `src/services/hooks/mutations/`
- Queries: `useQuery` in `src/services/hooks/query/`
- All API calls go through `apiClient` (handles auth + token refresh)

---

## Client State — Zustand Auth Store

```ts
// Source: apps/web/src/store/use-auth-store/use-auth-store.ts:16
const useAuthStore = create<IAuthStore>()(persist(
  (set) => ({
    accessToken: null, user: null, isLoggedIn: false,
    setAccessToken: (token) => set({ accessToken: token, isLoggedIn: true }),
    setUserDetails: (data) => set({ accessToken: data.token, isLoggedIn: true, user: data }),
    clearUserDetails: () => set({ accessToken: null, user: null, isLoggedIn: false }),
  }),
  { name: "auth-storage", partialize: (s) => ({ user: s.user, isLoggedIn: s.isLoggedIn }) }
));
```

**Key rule**: `accessToken` is memory-only (never persisted). Only `user` and `isLoggedIn` persist to localStorage.

---

## Forms

React Hook Form v7 + Zod v4. Schema in `src/lib/schema/`:

```ts
// Pattern from login form:
const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

---

## Routing

All routes are lazy-loaded. Add routes in `src/route-config.tsx`:

```ts
const DashboardPage = React.lazy(() => import("@/features/dashboard/dashboard"));
// Then wrap with ProtectedRoute or PublicRoute based on auth requirement
```

Route guards: `ProtectedRoute` (requires auth) and `PublicRoute` (redirects if logged in) read from `useAuthStore`.

---

## API Client

`src/services/api/client.ts` — use `apiClient` for all API calls:

```ts
import { apiClient } from "@/services/api/client";

export const loginPost = (body: ILoginBody) =>
  apiClient<ILoginResponse, ILoginBody>({ endpoint: "/api/v1/auth/login", method: "POST", body });
```

`apiClient` automatically:
1. Attaches `Authorization: Bearer <token>` from Zustand store
2. Retries on 401 after refreshing via httpOnly cookie
3. Queues concurrent requests during refresh
4. Hard-redirects to `/login` on refresh failure

---

## Adding a New Feature Page

1. Create `src/features/<feature>/<Feature>.tsx`
2. Add API functions in `src/services/api/<feature>.api.ts`
3. Add TanStack Query hooks in `src/services/hooks/`
4. Register lazy route in `src/route-config.tsx`
5. Add nav link to `src/layout/Sidebar.tsx` if needed

---

## Don't Do

| ❌ Avoid | ✅ Instead | Why |
|----------|-----------|-----|
| Inline style strings | `cn()` with Tailwind classes | Consistency |
| Store access token in localStorage | Keep in Zustand memory | Security |
| Direct `fetch()` calls | `apiClient()` wrapper | Missing auth + refresh |
| Import from `../../components` | `@/components` alias | Cleaner, refactor-safe |
| `new PrismaClient()` in web | N/A — frontend only | Wrong context |

---

## Quick Reference

| Need | Location |
|------|----------|
| shadcn/ui components | `src/components/ui/` (add via `npx shadcn add`) |
| Custom atoms | `src/components/atoms/` |
| `cn()` utility | `src/lib/utils.ts` |
| Auth store | `src/store/use-auth-store/use-auth-store.ts` |
| API client | `src/services/api/client.ts` |
| Auth API functions | `src/services/api/auth.api.ts` |
| Auth mutations hook | `src/services/hooks/mutations/useAuthMutation.ts` |
| Route config | `src/route-config.tsx` |
| Zod schemas | `src/lib/schema/` |
