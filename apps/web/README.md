# Web App

The React frontend for DEP Incubation Dashboard — built with Vite, Tailwind, and React 19.

## Quick Start

From the repo root:

```bash
pnpm dev:web
```

Then open http://localhost:5173

## Setup

**1. Environment**

Create `apps/web/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

This should point to your running backend (local dev, or UAT).

**2. Dependencies**

Already installed via `pnpm install` at repo root. If you add new packages:

```bash
pnpm install
```

## Development

**Run dev server:**
```bash
pnpm dev:web
```

**Build for production:**
```bash
pnpm build
```

**Run tests:**
```bash
pnpm test
```

**Storybook (component library):**
```bash
pnpm storybook
```
