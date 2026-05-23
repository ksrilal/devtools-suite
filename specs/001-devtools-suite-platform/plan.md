# Implementation Plan: DevTools Suite Platform

**Branch**: `master` | **Date**: 2026-05-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-devtools-suite-platform/spec.md`

---

## Summary

Build a 6-tool, client-side-only developer productivity platform (DevTools Suite) using Next.js 14 App Router with full SSG, TypeScript strict mode, Tailwind CSS, and shadcn/ui. All tool logic runs in the browser with zero server calls. The platform targets Lighthouse 95+ on every route, sub-1-second tool execution, and first-page Google rankings for developer tool keywords via an SEO-first static HTML architecture.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS

**Primary Dependencies**:
- Next.js 14 (App Router, SSG, next/image, next/font, next/script, next/dynamic)
- Tailwind CSS + tailwindcss-animate
- shadcn/ui (Button, Input, Textarea, Tabs, Accordion, Dialog, Toast, Badge, Progress, Collapsible, Tooltip, ScrollArea, Label, Switch, Select, Separator)
- lz-string (URL compression for checklist share)
- diff (line/char diffing — dynamic import)
- cronstrue + cron-parser (cron human-readable + next executions — dynamic import)
- @dnd-kit/core + @dnd-kit/sortable (drag-and-drop — dynamic import)
- @tanstack/react-virtual (list virtualisation — dynamic import)
- jspdf (PDF export — dynamic import)

**Storage**: Browser localStorage only — checklist workspace (`devtools_checklist_v1`) and theme preference (`devtools_theme`). Zero server-side storage.

**Testing**: Vitest (unit tests for all `lib/tools/*.ts` pure functions) + Playwright (E2E smoke tests, one per tool route)

**Target Platform**: Web — static HTML/CSS/JS deployed on Vercel Edge CDN. Works in all modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

**Project Type**: Static web application (SSG) — pure frontend

**Performance Goals**:
- Lighthouse Performance ≥ 95 on every route
- TTI < 1.0 s on throttled 4× CPU (Lighthouse audit)
- Per-route JS ≤ 50 KB gzipped (excl. shared vendor chunk ~75 KB)
- Tool execution ≤ 200 ms for typical inputs
- CLS < 0.05 across all pages
- LCP < 1.2 s, FID/INP < 100 ms, TTFB < 200 ms

**Constraints**:
- Zero API routes — no `app/api/` directory
- Zero `fetch()` in tool logic — no external network calls
- Zero `any` TypeScript types — strict mode enforced
- No CSS libraries other than Tailwind CSS + shadcn/ui
- All heavy libraries (jspdf, @dnd-kit, @tanstack/react-virtual, diff, cronstrue, cron-parser) must be dynamically imported and excluded from initial route bundles
- Every tool must pass the 12-item pre-merge checklist in CONSTITUTION.md §8

**Scale/Scope**: 6 tools, ~15 routes, ~50 components, ~12 lib modules. v1 launch scope.

---

## Constitution Check

*GATE: All gates pass. No violations. Re-checked after Phase 1 design — still passing.*

| Gate | Status | Notes |
|---|---|---|
| Next.js 14 App Router only | ✅ PASS | No Pages Router; no mixing |
| TypeScript strict mode | ✅ PASS | strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes |
| Tailwind CSS + shadcn/ui only | ✅ PASS | No other CSS frameworks or component libraries |
| Zero API routes | ✅ PASS | All tool logic is client-side |
| Zero fetch() in tool logic | ✅ PASS | No external calls from any tool module |
| Lighthouse 95+ gate | ✅ PASS | Enforced as required CI status check |
| Dark mode mandatory | ✅ PASS | Tailwind `dark:` class strategy + blocking no-FOUC script |
| Mobile responsive ≥ 320px | ✅ PASS | Tailwind responsive prefixes; tested at 375px |
| AdSense CLS-safe | ✅ PASS | Explicit min-height on all ad containers |
| Dynamic imports for heavy libs | ✅ PASS | All named heavy libs in dynamic import list above |
| Per-route JS ≤ 50 KB | ✅ PASS | Bundle analyzer in CI; see budget table in Phase 0 |
| No auth/session/DB | ✅ PASS | localStorage only; no cookies, no server state |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-devtools-suite-platform/
├── plan.md              # This file
├── research.md          # Phase 0: library decisions, resolved unknowns
├── data-model.md        # Phase 1: TypeScript types for all tool states
├── quickstart.md        # Phase 1: bootstrap, commands, Vercel deployment
├── contracts/
│   ├── lib-tools-api.md       # Pure function signatures for lib/tools/*
│   └── ui-component-api.md    # Props interfaces for components/shared/*
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT yet created)
```

### Source Code (repository root)

```text
devtools-suite/
├── app/
│   ├── layout.tsx                    # Root: ThemeProvider, AdSense, GA4, Nav, Footer
│   ├── page.tsx                      # Homepage: tool grid, categories, search filter
│   ├── globals.css
│   ├── robots.ts                     # Auto-generated robots.txt
│   ├── sitemap.ts                    # Auto-generated sitemap.xml
│   ├── checklist/
│   │   ├── page.tsx                  # Server Component: generateMetadata, ld+json
│   │   ├── loading.tsx               # Skeleton placeholder
│   │   └── _components/
│   │       └── ChecklistTool.tsx     # 'use client' — full checklist workspace
│   ├── json-formatter/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── _components/
│   │       ├── JSONFormatterTool.tsx
│   │       └── JSONTreeView.tsx      # Dynamically imported on "Tree View" toggle
│   ├── cron-generator/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── _components/
│   │       └── CronGeneratorTool.tsx
│   ├── diff-checker/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── _components/
│   │       └── DiffCheckerTool.tsx
│   ├── jwt-decoder/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── _components/
│   │       └── JWTDecoderTool.tsx
│   ├── regex-tester/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── _components/
│   │       └── RegexTesterTool.tsx
│   ├── about/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
│
├── components/
│   ├── ui/                           # shadcn/ui primitives (auto-generated, never edited)
│   └── shared/
│       ├── Nav.tsx                   # Server Component
│       ├── Footer.tsx                # Server Component
│       ├── ThemeProvider.tsx         # 'use client' — context + localStorage
│       ├── ThemeToggle.tsx           # 'use client' — island inside Nav
│       ├── ToolLayout.tsx            # Server Component — outer shell for all tool pages
│       ├── Toolbar.tsx               # 'use client' — sticky action bar
│       ├── AdSlot.tsx                # 'use client' — AdSense ins element
│       ├── CopyButton.tsx            # 'use client'
│       ├── DownloadButton.tsx        # 'use client'
│       ├── ShareButton.tsx           # 'use client'
│       ├── SplitPane.tsx             # 'use client' — sync scroll between two panes
│       ├── PrivacyNotice.tsx         # Server Component
│       ├── FAQSection.tsx            # Server Component
│       ├── ToolCard.tsx              # Server Component
│       ├── ToolDescription.tsx       # Server Component
│       └── KeyboardShortcutModal.tsx # 'use client'
│
├── lib/
│   ├── utils.ts                      # cn(), copyToClipboard, downloadFile, debounce, localStorage helpers
│   ├── ads-config.ts                 # AdSense slot constants + publisher ID
│   ├── tools-registry.ts             # ToolDefinition[] — single source of truth
│   ├── seo-helpers.ts                # buildMetadata(), buildSoftwareApplicationLD(), buildFAQLD()
│   └── tools/
│       ├── checklist.ts              # Pure TS: parse, encode/decode, export, state transitions
│       ├── checklist.test.ts
│       ├── json-formatter.ts         # Pure TS: format, minify, tokenise, sort keys
│       ├── json-formatter.test.ts
│       ├── cron-generator.ts         # Pure TS: build, parse, validate, format conversions, next runs
│       ├── cron-generator.test.ts
│       ├── diff-checker.ts           # Pure TS: diffLines, diffChars, diffJSON, patch format
│       ├── diff-checker.test.ts
│       ├── jwt-decoder.ts            # Pure TS: decode, expiry status, claim annotations
│       ├── jwt-decoder.test.ts
│       ├── regex-tester.ts           # Pure TS: compile, match, replace, explain, tokenise
│       └── regex-tester.test.ts
│
├── public/
│   └── og/                           # Pre-built OG images (7 × 1200×630 PNG)
│       ├── home.png
│       ├── checklist.png
│       ├── json-formatter.png
│       ├── cron-generator.png
│       ├── diff-checker.png
│       ├── jwt-decoder.png
│       └── regex-tester.png
│
├── tests/
│   └── e2e/
│       ├── checklist.spec.ts
│       ├── json-formatter.spec.ts
│       ├── cron-generator.spec.ts
│       ├── diff-checker.spec.ts
│       ├── jwt-decoder.spec.ts
│       └── regex-tester.spec.ts
│
├── CONSTITUTION.md
├── .env.example
├── .env.local                        # gitignored
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── .husky/pre-commit
```

**Structure Decision**: Next.js App Router with route-colocated `_components/` for tool-specific UI (never imported by other routes). Shared reusable components in `components/shared/`. Pure TypeScript logic in `lib/tools/` (no React, no DOM). This matches CONSTITUTION.md §2.3 exactly.

---

## Phase 0: Research Summary

See [research.md](research.md) for full findings. Key decisions:

| Topic | Decision | Rationale |
|---|---|---|
| JWT decode | Manual `atob` + base64url — zero library | JWT decode is 3 lines; `jwt-decode` adds 5 KB for nothing |
| JSON syntax highlight | Custom 2 KB tokeniser | Full Prism.js is 90 KB — exceeds route budget |
| Diff engine | `diff` npm package (10 KB gzipped) | `diff-match-patch` is 30 KB and designed for collaborative editing |
| Cron next-executions | `cron-parser` (fallback: `croner`) | Handles DST; correct iterator API |
| Cron human-readable | `cronstrue` (15 KB dynamic) | Most widely used; MIT; handles all 5-field patterns |
| DnD | `@dnd-kit/core` + sortable | Smallest footprint; accessible; touch support; actively maintained |
| List virtualisation | `@tanstack/react-virtual` (triggered > 200 items) | Industry standard; 10 KB; conditional use avoids overhead for small lists |
| PDF export | `jspdf` (on-click dynamic) | Pure client-side; sufficient for text checklist; never in initial bundle |
| URL compression | `lz-string` `compressToEncodedURIComponent` | 2 KB; compresses 100-item JSON from ~4 KB to ~400 bytes |
| Theme no-FOUC | Blocking inline `<head>` script | Canonical solution; < 200 bytes; prevents white flash before hydration |
| Analytics | GA4 via `next/script strategy="afterInteractive"` | Does not block TTI; standard Next.js pattern |

---

## Phase 1: Design Artifacts

- [data-model.md](data-model.md) — TypeScript types for all 6 tool states, shared platform types, localStorage key registry
- [contracts/lib-tools-api.md](contracts/lib-tools-api.md) — Complete function signatures for all `lib/tools/*` pure modules
- [contracts/ui-component-api.md](contracts/ui-component-api.md) — Props interfaces for all `components/shared/*` components
- [quickstart.md](quickstart.md) — Bootstrap commands, full folder tree, Vercel deployment guide, pre-merge checklist

---

## Implementation Phases

### Phase A — Foundation (implement first, blocks all tools)

| # | Task | Files |
|---|---|---|
| A1 | Next.js 14 scaffold with strict TS config | package.json, tsconfig.json, next.config.ts |
| A2 | Tailwind + shadcn/ui init; install all shadcn components | tailwind.config.ts, components/ui/* |
| A3 | ThemeProvider + no-FOUC blocking script in root layout | components/shared/ThemeProvider.tsx, app/layout.tsx |
| A4 | Nav + Footer + ToolLayout shared components | components/shared/Nav.tsx, Footer.tsx, ToolLayout.tsx |
| A5 | AdSlot component + lib/ads-config.ts | components/shared/AdSlot.tsx, lib/ads-config.ts |
| A6 | GA4 + AdSense scripts in root layout | app/layout.tsx |
| A7 | lib/utils.ts — cn(), copyToClipboard, downloadFile, debounce, localStorage helpers | lib/utils.ts |
| A8 | lib/seo-helpers.ts — metadata builders, ld+json builders | lib/seo-helpers.ts |
| A9 | lib/tools-registry.ts — TOOLS constant | lib/tools-registry.ts |
| A10 | robots.ts + sitemap.ts | app/robots.ts, app/sitemap.ts |
| A11 | Homepage with tool grid + category grouping + search filter | app/page.tsx |
| A12 | Shared action components: CopyButton, DownloadButton, ShareButton, Toolbar | components/shared/* |
| A13 | Vitest + Playwright + Husky + lint-staged setup | vitest.config.ts, playwright.config.ts, .husky/* |
| A14 | `prefers-reduced-motion` — wrap all animated elements with `motion-safe:` Tailwind variant; verify in globals.css and all shared components | app/globals.css, components/shared/* |

### Phase B — Flagship: Smart Checklist

| # | Task | Files |
|---|---|---|
| B1 | lib/tools/checklist.ts — all pure functions | lib/tools/checklist.ts |
| B2 | lib/tools/checklist.test.ts — full unit test coverage | lib/tools/checklist.test.ts |
| B3 | app/checklist/page.tsx — metadata, ld+json, FAQ, SEO content | app/checklist/page.tsx |
| B4 | app/checklist/loading.tsx — skeleton | app/checklist/loading.tsx |
| B5 | ChecklistTool.tsx — input parser, item list, state management | app/checklist/_components/ChecklistTool.tsx |
| B6 | Drag-and-drop reorder (dynamic import @dnd-kit) | ChecklistTool.tsx |
| B7 | Progress bar + search/filter + keyboard navigation | ChecklistTool.tsx |
| B8 | localStorage persistence + URL share encoding | ChecklistTool.tsx, lib/tools/checklist.ts |
| B9 | Export: plain text, Markdown, CSV (sync); PDF (dynamic jspdf) | ChecklistTool.tsx |
| B10 | Virtualisation for > 200 items (dynamic @tanstack/react-virtual) | ChecklistTool.tsx |
| B11 | Print mode CSS | app/globals.css |
| B12 | Lighthouse audit — verify ≥ 95 on /checklist | CI |
| B13 | E2E smoke test | tests/e2e/checklist.spec.ts |

### Phase C — Data Tools

| # | Task | Files |
|---|---|---|
| C1 | lib/tools/json-formatter.ts + tests | lib/tools/json-formatter.ts + .test.ts |
| C2 | JSONFormatterTool.tsx — editor, format/minify/sort, copy/download | app/json-formatter/_components/ |
| C3 | JSONTreeView.tsx — collapsible tree (dynamic import) | app/json-formatter/_components/JSONTreeView.tsx |
| C4 | app/json-formatter/page.tsx — metadata, ld+json | app/json-formatter/page.tsx |
| C5 | lib/tools/jwt-decoder.ts + tests | lib/tools/jwt-decoder.ts + .test.ts |
| C6 | JWTDecoderTool.tsx — three panels, claim annotations, expiry badge | app/jwt-decoder/_components/ |
| C7 | app/jwt-decoder/page.tsx — metadata, ld+json | app/jwt-decoder/page.tsx |

### Phase D — Developer Utilities

| # | Task | Files |
|---|---|---|
| D1 | lib/tools/cron-generator.ts + tests | lib/tools/cron-generator.ts + .test.ts |
| D2 | CronGeneratorTool.tsx — visual builder, presets, next executions, format outputs | app/cron-generator/_components/ |
| D3 | app/cron-generator/page.tsx — metadata, ld+json | app/cron-generator/page.tsx |
| D4 | lib/tools/regex-tester.ts + tests | lib/tools/regex-tester.ts + .test.ts |
| D5 | RegexTesterTool.tsx — pattern input, flags, live matching, replace, explainer, test cases | app/regex-tester/_components/ |
| D6 | app/regex-tester/page.tsx — metadata, ld+json | app/regex-tester/page.tsx |

### Phase E — Diff Checker

| # | Task | Files |
|---|---|---|
| E1 | lib/tools/diff-checker.ts + tests | lib/tools/diff-checker.ts + .test.ts |
| E2 | SplitPane component with sync scroll | components/shared/SplitPane.tsx |
| E3 | DiffCheckerTool.tsx — side-by-side, unified view, char diff, JSON diff, file upload | app/diff-checker/_components/ |
| E4 | app/diff-checker/page.tsx — metadata, ld+json | app/diff-checker/page.tsx |

### Phase F — Polish & Launch Readiness

| # | Task | Files |
|---|---|---|
| F1 | Generate 7 OG images (1200×630 PNG) | public/og/*.png |
| F2 | /about, /privacy, /terms pages | app/about|privacy|terms/page.tsx |
| F3 | Complete E2E Playwright suite — all 6 tools | tests/e2e/*.spec.ts |
| F4 | Lighthouse CI configuration | .lighthouserc.js |
| F5 | Bundle analyzer pass — verify all route budgets | CI |
| F6 | Full 12-item pre-merge checklist audit — all 6 tools | CONSTITUTION.md §8 |
| F7 | Production deploy to Vercel | Vercel dashboard |
| F8 | Google Search Console setup + sitemap submission | GSC |

---

## SEO Strategy Per Tool

| Route | Title (≤ 60 chars) | Primary Keyword | H1 |
|---|---|---|---|
| `/` | DevTools Suite — Free Developer Tools Online | developer tools online | Free Developer Tools for Modern Workflows |
| `/checklist` | Smart Checklist Tool — Free Online Checklist | online checklist tool | Smart Online Checklist Maker for Developers |
| `/json-formatter` | JSON Formatter & Validator — Beautify JSON Online | json formatter online | JSON Formatter, Validator & Beautifier |
| `/cron-generator` | Cron Expression Generator — Visual Cron Builder | cron expression generator | Visual Cron Expression Generator and Parser |
| `/diff-checker` | Text Diff Checker — Compare Texts Side by Side | text diff checker | Online Text and JSON Diff Checker |
| `/jwt-decoder` | JWT Decoder — Decode JWT Tokens Online | jwt decoder | JWT Token Decoder and Inspector |
| `/regex-tester` | Regex Tester — Debug Regular Expressions Online | regex tester online | Online Regex Tester, Debugger & Explainer |

---

## Performance Budget

| Route | Estimated initial JS (gzipped) | Heavy deps loaded dynamically |
|---|---|---|
| `/` | ~20 KB | none |
| `/checklist` | ~27 KB (incl. lz-string ~2 KB) | @dnd-kit, jspdf, @tanstack/react-virtual |
| `/json-formatter` | ~18 KB | JSON tokeniser component, JSONTreeView |
| `/cron-generator` | ~15 KB | cronstrue, cron-parser |
| `/diff-checker` | ~18 KB | diff package |
| `/jwt-decoder` | ~10 KB | none (manual decode) |
| `/regex-tester` | ~20 KB | regex explainer tokeniser |
| Shared vendor chunk | ~75 KB (cached after first load) | React, Next.js, Tailwind, shadcn |

---

## Keyboard Shortcut System

### Global (root layout)
| Shortcut | Action |
|---|---|
| `Ctrl+D` / `Cmd+D` | Toggle dark/light mode |
| `?` | Open keyboard shortcut help modal |

> `?` is the canonical shortcut for the help modal (not `Ctrl+/`). The `?` key is unambiguous and matches the spec §3.3.

### All tools
| Shortcut | Action |
|---|---|
| `Ctrl+Enter` / `Cmd+Enter` | Execute primary tool action |
| `Ctrl+Shift+C` | Copy output |
| `Ctrl+Shift+X` | Clear all |
| `Escape` | Close modal / clear filter |

### Checklist-specific
| Shortcut | Action |
|---|---|
| `↑` / `↓` | Move focus between items |
| `Space` | Cycle item state |
| `X` | Mark item invalid |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Route bundle > 50 KB | Medium | High | Bundle analyzer in CI; dynamic import all heavy libs |
| Lighthouse < 95 due to AdSense CLS | Medium | High | Explicit min-height on all ad containers; test before merge |
| `cron-parser` bundle too large | Low | Medium | Fallback to `croner` (8 KB gzipped) |
| iOS Safari DnD quirks | Low | Medium | @dnd-kit has explicit touch sensor; test on real device |
| lz-string URL too long (200+ items) | Low | Low | Warn user at > 500 items; offer plain copy |
| Print mode broken in Firefox | Low | Low | Use standard `@media print` CSS only |

---

## Complexity Tracking

No constitution violations requiring justification. All design decisions comply with CONSTITUTION.md. No complexity table entries needed.
