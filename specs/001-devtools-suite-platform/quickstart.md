# Quickstart Guide: DevTools Suite

**Phase**: 1 — Design
**Date**: 2026-05-23

> Step-by-step instructions to bootstrap, develop, and deploy the project.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20 LTS | Required by Next.js 14 |
| npm | 10+ | Comes with Node 20 |
| Git | any | For version control |
| VS Code | any | Recommended; Tailwind IntelliSense extension |

---

## 1. Bootstrap the Project

```bash
# Create Next.js 14 app
npx create-next-app@14 devtools-suite \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd devtools-suite
```

---

## 2. Configure TypeScript (strict)

Edit `tsconfig.json` — add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 3. Install shadcn/ui

```bash
npx shadcn-ui@latest init
# Prompts:
# ✓ Style: Default
# ✓ Base color: Slate
# ✓ CSS variables: Yes
# ✓ Tailwind config: tailwind.config.ts
# ✓ Global CSS: app/globals.css
# ✓ Components: components/ui
# ✓ Utils: lib/utils.ts
```

Install required shadcn components:

```bash
npx shadcn-ui@latest add button input textarea select tabs
npx shadcn-ui@latest add accordion dialog toast badge progress
npx shadcn-ui@latest add scroll-area separator label switch
npx shadcn-ui@latest add collapsible tooltip
```

---

## 4. Install Runtime Dependencies

```bash
# Core (always in bundle)
npm install lz-string

# Dynamic imports (not in initial bundle)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install @tanstack/react-virtual
npm install jspdf
npm install diff
npm install cronstrue cron-parser

# Dev tools
npm install -D vitest @vitest/ui jsdom @vitejs/plugin-react
npm install -D @playwright/test
npm install -D @next/bundle-analyzer
npm install -D husky lint-staged prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

## 5. Configure Tailwind

`tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: 'class',  // CRITICAL: enables dark: variants
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## 6. Configure Vitest

`vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['lib/tools/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

---

## 7. Configure Husky + lint-staged

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

`.lintstagedrc.js`:
```javascript
module.exports = {
  '**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md,css}': ['prettier --write'],
}
```

---

## 8. Environment Variables

`.env.local` (never committed):
```bash
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-REPLACE_ME
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-REPLACE_ME
```

`.env.example` (committed as documentation):
```bash
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-REPLACE_ME
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-REPLACE_ME
```

`lib/ads-config.ts`:
```typescript
export const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? '';

export const AD_SLOTS = {
  HEADER_BANNER: {
    slotId: 'REPLACE_WITH_SLOT_ID',
    format: 'horizontal' as const,
    minHeightPx: 90,
    minHeightMobilePx: 50,
  },
  SIDEBAR: {
    slotId: 'REPLACE_WITH_SLOT_ID',
    format: 'rectangle' as const,
    minHeightPx: 250,
    minHeightMobilePx: 250,
  },
  IN_CONTENT: {
    slotId: 'REPLACE_WITH_SLOT_ID',
    format: 'responsive' as const,
    minHeightPx: 100,
    minHeightMobilePx: 100,
  },
} as const;
```

---

## 9. Folder Structure (final)

```
devtools-suite/
├── app/
│   ├── layout.tsx                   # Root layout: ThemeProvider, AdSense, GA4, Nav, Footer
│   ├── page.tsx                     # Homepage: tool grid, search, SEO
│   ├── globals.css
│   ├── robots.ts                    # next/metadata robots route
│   ├── sitemap.ts                   # next/metadata sitemap route
│   ├── checklist/
│   │   ├── page.tsx                 # generateMetadata + Server Component shell
│   │   ├── loading.tsx              # Suspense skeleton
│   │   └── _components/
│   │       └── ChecklistTool.tsx    # 'use client'
│   ├── json-formatter/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── _components/
│   │       ├── JSONFormatterTool.tsx
│   │       └── JSONTreeView.tsx     # dynamically imported
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
│   ├── about/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
│
├── components/
│   ├── ui/                          # shadcn primitives (auto-generated, do not edit)
│   └── shared/
│       ├── Nav.tsx
│       ├── Footer.tsx
│       ├── ThemeProvider.tsx
│       ├── ThemeToggle.tsx
│       ├── ToolLayout.tsx
│       ├── Toolbar.tsx
│       ├── AdSlot.tsx
│       ├── CopyButton.tsx
│       ├── DownloadButton.tsx
│       ├── ShareButton.tsx
│       ├── SplitPane.tsx
│       ├── PrivacyNotice.tsx
│       ├── FAQSection.tsx
│       ├── ToolCard.tsx
│       ├── ToolDescription.tsx
│       └── KeyboardShortcutModal.tsx
│
├── lib/
│   ├── utils.ts                     # cn(), copyToClipboard, downloadFile, etc.
│   ├── ads-config.ts                # AdSense slot constants
│   ├── tools-registry.ts            # ToolDefinition[] — single source of truth
│   ├── seo-helpers.ts               # generateMetadata helpers, ld+json builders
│   └── tools/
│       ├── checklist.ts
│       ├── checklist.test.ts
│       ├── json-formatter.ts
│       ├── json-formatter.test.ts
│       ├── cron-generator.ts
│       ├── cron-generator.test.ts
│       ├── diff-checker.ts
│       ├── diff-checker.test.ts
│       ├── jwt-decoder.ts
│       ├── jwt-decoder.test.ts
│       ├── regex-tester.ts
│       └── regex-tester.test.ts
│
├── public/
│   ├── og/                          # Pre-generated OG images (1200×630 PNG)
│   │   ├── home.png
│   │   ├── checklist.png
│   │   ├── json-formatter.png
│   │   ├── cron-generator.png
│   │   ├── diff-checker.png
│   │   ├── jwt-decoder.png
│   │   └── regex-tester.png
│   ├── favicon.ico
│   └── icons/                       # PWA icons (optional)
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
├── specs/                           # Speckit planning artifacts
├── CONSTITUTION.md
├── SPEC.md
├── .env.example
├── .env.local                       # gitignored
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── next.config.ts
└── .husky/
```

---

## 10. Development Commands

```bash
# Development
npm run dev                    # Start dev server at localhost:3000

# Build & test
npm run build                  # Production build
npm run start                  # Production server (post-build)
npm run type-check             # tsc --noEmit
npm run lint                   # ESLint
npm run format                 # Prettier write
npm run test                   # Vitest unit tests
npm run test:ui                # Vitest UI browser
npm run e2e                    # Playwright tests (requires npm run build first)
npm run e2e:ui                 # Playwright UI mode

# Analysis
npm run analyze                # Bundle analyzer (ANALYZE=true next build)
npm run lighthouse             # Lighthouse CI (requires lhci installed)
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "analyze": "ANALYZE=true next build",
    "lighthouse": "lhci autorun"
  }
}
```

---

## 11. Vercel Deployment

1. Push to GitHub (main branch)
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
4. Deploy — Vercel auto-detects Next.js 14, no additional config needed
5. Assign custom domain
6. Add domain to Google Search Console
7. Submit sitemap URL: `https://yourdomain.com/sitemap.xml`

**Vercel config** (`vercel.json` — optional, only if headers needed):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 12. Pre-Merge Checklist (per tool)

Copy this into every tool PR description:

```
- [ ] Route at app/[slug]/page.tsx with unique generateMetadata()
- [ ] loading.tsx skeleton present
- [ ] SoftwareApplication + FAQPage ld+json included
- [ ] All logic in lib/tools/[slug].ts (pure TS, zero React/DOM)
- [ ] 'use client' component wires lib function to UI
- [ ] Lighthouse CI passes (95+ all 4 categories)
- [ ] Works at 375px width (tested in Chrome DevTools)
- [ ] Works in dark mode (tested with class="dark" on <html>)
- [ ] AdSense slots rendered (not blocked by tool logic)
- [ ] Tool executes in < 1s on throttled 4× CPU Lighthouse audit
- [ ] Unit tests for lib/tools/[slug].ts — all passing
- [ ] E2E smoke test added to tests/e2e/[slug].spec.ts
```
