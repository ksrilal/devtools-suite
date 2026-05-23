# DevTools Suite — Project Constitution

> This document is the authoritative rulebook for every decision made in this codebase.
> Treat each principle as a hard constraint, not a preference.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | No Pages Router. No mixing. |
| Language | TypeScript (strict) | `strict: true` in tsconfig. No `any`. No `@ts-ignore`. |
| Styling | Tailwind CSS + shadcn/ui | No other CSS libraries, no CSS Modules, no inline style objects. |
| Runtime | Browser only | Zero API routes. Zero server actions that hit external services. |

**Violations:** Any PR that adds an API route (`app/api/`), a server action with a network call, or a non-Tailwind/shadcn styling mechanism is rejected.

---

## 2. Architecture

### 2.1 Client-Side Execution
- All tool logic executes entirely in the browser.
- `'use client'` is the default for tool components.
- Server Components are allowed only for static shells (layout, metadata, page wrappers) that contain zero logic.
- No `fetch()` calls to internal or external APIs from tool logic.
- No environment variables exposed at runtime (`NEXT_PUBLIC_*` is allowed only for static config like AdSense IDs).

### 2.2 No Auth, No DB, No Backend
- Zero authentication flows. No session cookies, no JWTs, no OAuth.
- Zero database connections. No ORM, no Prisma, no Drizzle, no SQL.
- No server-side state. No Redis, no KV, no file system writes.
- Persistence is limited to `localStorage` / `sessionStorage` / URL query params.

### 2.3 File & Folder Structure
```
app/
  layout.tsx          # Root layout — AdSense slots live here
  page.tsx            # Homepage / tool directory
  [tool-slug]/
    page.tsx          # Unique metadata export + tool shell
    _components/      # Tool-specific components (never shared upward)
components/
  ui/                 # shadcn/ui primitives only
  shared/             # Cross-tool shared components (ads, header, footer)
lib/
  tools/              # Pure TS tool logic (no React, no DOM)
  utils.ts            # cn() and other shared utilities
```

---

## 3. Performance

### 3.1 Lighthouse 95+ on Every Page
- Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Run `next build && next start` + Lighthouse CI before any merge to main.
- Images: always use `next/image` with explicit `width`, `height`, and `alt`.
- Fonts: load via `next/font`. No `<link rel="stylesheet">` for Google Fonts.
- No layout shift (CLS < 0.1): reserve space for ads and async content with explicit dimensions.

### 3.2 Sub-1-Second Tool Load & Execution
- Tool page JS budget: ≤ 50 KB gzipped per route (excluding shared vendor chunks).
- Heavy libraries (e.g., a parser, a codec) must be dynamically imported with `next/dynamic` and a skeleton placeholder.
- Tool execution (the core compute) must complete in ≤ 200 ms for typical inputs on a mid-range device.
- No blocking synchronous operations on the main thread > 50 ms — offload to a Web Worker if needed.
- `loading.tsx` must exist for every tool route to enable streaming suspense.

### 3.3 Core Web Vitals Targets
| Metric | Target |
|---|---|
| LCP | < 1.2 s |
| FID / INP | < 100 ms |
| CLS | < 0.05 |
| TTFB | < 200 ms (static) |

---

## 4. SEO

- Every `app/[tool-slug]/page.tsx` must export a `generateMetadata()` function.
- Required fields per page: `title`, `description`, `keywords`, `openGraph.title`, `openGraph.description`, `openGraph.image`, `twitter.card`, `twitter.title`, `twitter.description`, `canonical`.
- Titles follow the pattern: `{Tool Name} — Free Online {Category} Tool | DevTools Suite`.
- Descriptions are 150–160 characters, unique, and keyword-rich.
- No two pages share the same `title` or `description`.
- Structured data (`application/ld+json`) with `SoftwareApplication` schema is required on every tool page.
- `robots.txt` and `sitemap.xml` are auto-generated via Next.js metadata routes.

---

## 5. UI & Theming

### 5.1 Dark Mode
- Dark mode is mandatory on every tool — not optional, not a stretch goal.
- Use Tailwind's `dark:` variants exclusively. No JavaScript theme switching that causes FOUC.
- Root layout sets `class="dark"` toggled via a `ThemeProvider` that reads from `localStorage` with a blocking inline script to prevent flash.
- Default theme: system preference (`prefers-color-scheme`).

### 5.2 Mobile Responsiveness
- Every tool is fully functional on viewports ≥ 320 px wide.
- Layouts use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`). No hardcoded pixel widths.
- Touch targets are ≥ 44 × 44 px (WCAG 2.5.5).
- Test every tool at 375 px (iPhone SE) and 768 px (tablet) before marking done.

### 5.3 Component Rules
- Use shadcn/ui primitives for all interactive elements (Button, Input, Select, Dialog, Tabs, etc.).
- Do not fork shadcn components — configure via `className` props and Tailwind variants only.
- Animations use Tailwind's `transition-*` utilities or `tailwindcss-animate`. No framer-motion unless a tool explicitly requires it and it is dynamically imported.

---

## 6. Monetization — Google AdSense

- AdSense script is loaded once in `app/layout.tsx` via `next/script` with `strategy="afterInteractive"`.
- Pre-defined slot IDs live in `lib/ads-config.ts` as named constants — never hardcoded inline.
- Ad slot placements per page:
  - **Header banner** (728×90 desktop / 320×50 mobile) — above the fold after the nav.
  - **Sidebar** (300×250) — right column on ≥ md breakpoint, collapsed on mobile.
  - **In-content** (responsive) — between tool output and footer.
- Ad containers have explicit min-height set to their ad unit size to prevent CLS.
- Ads must never block or delay tool interactivity. AdSense script loads after `load` event.
- A `<noscript>` fallback placeholder is included in each ad container.

---

## 7. Code Quality

### 7.1 TypeScript Rules
- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` all enabled.
- No `as` type assertions without a comment explaining why it is safe.
- Zod is the only allowed runtime validation library (for URL param parsing if needed).

### 7.2 Linting & Formatting
- ESLint with `eslint-config-next` + `@typescript-eslint/recommended-type-checked`.
- Prettier for formatting — no style debates in PRs.
- Husky pre-commit: `lint-staged` runs ESLint + Prettier on staged files.

### 7.3 Testing
- Pure tool logic in `lib/tools/` must have unit tests (Vitest).
- No UI snapshot tests — they are noise.
- Playwright E2E smoke test for every tool: load page, enter a valid input, assert a non-empty output.

---

## 8. Tool Development Checklist

Every new tool must satisfy all items before merge:

- [ ] Route at `app/[tool-slug]/page.tsx` with unique `generateMetadata()` export
- [ ] `loading.tsx` skeleton present
- [ ] Structured data (`ld+json`) included
- [ ] All logic in `lib/tools/[tool-slug].ts` (pure TS, no React imports)
- [ ] `'use client'` component wires lib function to UI
- [ ] Lighthouse CI passes (95+ all categories)
- [ ] Works at 375 px width
- [ ] Works in dark mode
- [ ] AdSense slots rendered (not blocked by tool logic)
- [ ] Executes in < 1 s on a throttled 4× CPU Lighthouse audit
- [ ] Unit tests for `lib/tools/[tool-slug].ts`
- [ ] E2E smoke test added to Playwright suite

---

## 9. Prohibited Patterns

The following are banned and will be rejected in code review:

| Pattern | Reason |
|---|---|
| `app/api/*` routes | Violates client-side-only rule |
| `fetch()` inside tool logic | Violates no-backend rule |
| `import 'some-css-library'` | Violates Tailwind-only rule |
| `style={{ ... }}` objects | Violates Tailwind-only rule |
| `useEffect` for SEO data | SEO must be server-rendered metadata |
| `window.location.href =` redirects | Use `next/navigation` |
| Untyped `any` | Violates strict TypeScript rule |
| Image `<img>` tags | Use `next/image` |
| `<a>` tags for internal links | Use `next/link` |
| Synchronous CPU work > 50 ms on main thread | Offload to Web Worker |
| Auth, session, or user state | No login allowed |

---

## 10. Versioning & Releases

- `main` branch is always deployable to Vercel.
- Feature branches: `feat/[tool-slug]`, `fix/[description]`, `chore/[description]`.
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `perf:`, `chore:`, `docs:`.
- Lighthouse CI is a required status check — red lighthouse blocks merge.
- Bundle size check via `@next/bundle-analyzer` is run on every PR touching `app/` or `lib/`.
