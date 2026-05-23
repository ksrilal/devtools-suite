# Research: DevTools Suite Platform

**Phase**: 0 — Technology & Pattern Research
**Date**: 2026-05-23
**Feature**: 001-devtools-suite-platform

---

## 1. Next.js 14 App Router — Static Generation Strategy

**Decision**: Use `export const dynamic = 'force-static'` on all tool pages. Root layout, `sitemap.ts`, and `robots.ts` use Next.js Metadata Route APIs.

**Rationale**: All tool pages are pure static HTML shells — zero server-side data fetching. SSG maximises CDN cache hit rate on Vercel Edge Network (TTFB < 50 ms globally). `generateMetadata()` is evaluated at build time, so SEO tags are baked into the HTML.

**Alternatives considered**:
- ISR (Incremental Static Regeneration): No dynamic content to revalidate — unnecessary.
- Server Components with dynamic rendering: Violates zero-backend constraint.

---

## 2. Library Selection — Final Decisions

### 2a. Checklist: Drag-and-Drop

**Decision**: `@dnd-kit/core` + `@dnd-kit/sortable` (dynamically imported)

**Rationale**: Smallest footprint among production-grade DnD libraries (~12 KB gzipped core). Built for React, accessible by default (ARIA attributes, keyboard support). Works on touch devices. Alternatives like `react-beautiful-dnd` (archived/unmaintained) and `dnd-kit` v6 are the current standard.

**Bundle strategy**: Wrap in `next/dynamic` with `ssr: false`. Load only when checklist workspace mounts.

### 2b. Checklist: PDF Export

**Decision**: `jspdf` (dynamically imported, on-click only)

**Rationale**: Pure client-side, no canvas required for simple text lists. ~200 KB before gzip; never in the initial bundle. `html2canvas` + `jspdf` produces higher fidelity but adds 400 KB — unnecessary for a text checklist.

**Bundle strategy**: `const { jsPDF } = await import('jspdf')` inside the export handler function.

### 2c. Checklist: URL Encoding

**Decision**: `lz-string` with `compressToEncodedURIComponent` / `decompressFromEncodedURIComponent`

**Rationale**: A 100-item checklist serialised as JSON is ~3–5 KB; compressed it becomes ~300–600 bytes — within safe URL length limits for all major platforms (Twitter: 4096 chars, WhatsApp: no formal limit). Pure client-side, 2 KB gzipped.

**Schema for URL state**:
```typescript
interface ChecklistURLState {
  v: 1;                           // schema version
  items: Array<[string, 0|1|2]>; // [text, state: 0=unchecked,1=checked,2=invalid]
}
```

### 2d. Checklist: Virtualisation

**Decision**: `@tanstack/react-virtual` (dynamically imported, triggered at > 200 items)

**Rationale**: Industry standard for React list virtualisation. The `useVirtualizer` hook provides row-height measurement and smooth scroll. < 10 KB gzipped. Applied conditionally — lists ≤ 200 items use standard DOM for simplicity.

### 2e. JSON Formatter: Syntax Highlighting

**Decision**: Custom lightweight tokeniser (no external library)

**Rationale**: Full Prism.js is 90 KB gzipped — too large for the 50 KB route budget. JSON has only 7 token types (string, number, boolean, null, key, bracket, punctuation). A hand-written regex tokeniser is ~2 KB and covers all cases. Output is a `<span>`-wrapped HTML string rendered with `dangerouslySetInnerHTML` (safe — input never contains user-executable code in JSON context; all tokens are escaped before injection).

**Security note**: The tokeniser must HTML-escape `<`, `>`, `&` in string values before wrapping in `<span>` tags.

### 2f. JSON Tree View

**Decision**: Custom recursive React component (dynamically imported)

**Rationale**: Third-party JSON tree libraries (react-json-view: 150 KB, react-json-tree: 40 KB) exceed budget and pull in unnecessary theming systems. A 200-line recursive component using shadcn Collapsible handles all needed cases: expand/collapse nodes, show types, truncate long strings.

### 2g. Cron: Human-Readable Interpretation

**Decision**: `cronstrue` (dynamically imported)

**Rationale**: The most widely-used cron-to-English library. 15 KB gzipped. Handles Unix 5-field and 6-field (with seconds) cron. Supports multiple locales (though only English needed for v1). MIT licence.

### 2h. Cron: Next Execution Times

**Decision**: `cron-parser` (dynamically imported)

**Rationale**: Provides an iterator API for computing next N dates from a cron expression. Handles DST transitions correctly. Does not mutate global state. 20 KB gzipped. Alternatives: `croner` (actively maintained, 8 KB — preferred if `cron-parser` shows issues).

**Fallback**: If `cron-parser` adds > 20 KB to the cron route bundle, switch to `croner`.

### 2i. Diff Engine

**Decision**: `diff` npm package (dynamically imported)

**Rationale**: The canonical JS diff library (used by Jest, Mocha, etc.). Provides `diffLines`, `diffChars`, `diffWords` — covering all three diff modes needed. 10 KB gzipped. `diff-match-patch` (Google) is larger at 30 KB and better suited for collaborative editing — overkill here.

### 2j. JWT Decoding

**Decision**: Manual base64url decoding (no library)

**Rationale**: JWT decoding is a two-line operation: split on `.`, base64url-decode each part, `JSON.parse`. The `jwt-decode` library adds 5 KB for this trivial operation. Rolling our own: zero dependency, zero attack surface, perfectly auditable.

```typescript
function decodeJWT(token: string) {
  const [headerB64, payloadB64, sig] = token.split('.');
  const decode = (b64: string) => JSON.parse(
    atob(b64.replace(/-/g, '+').replace(/_/g, '/'))
  );
  return { header: decode(headerB64), payload: decode(payloadB64), signature: sig };
}
```

### 2k. Regex Explainer

**Decision**: Custom rule-based tokeniser

**Rationale**: No maintained library exists for regex-to-English translation at acceptable bundle size. The tokeniser walks the regex pattern character by character, producing an AST of token types (anchor, group, quantifier, character class, alternation, escape, literal). Each token type maps to a plain-English template string. Covers ~95% of common developer patterns.

---

## 3. Theme System — No-FOUC Strategy

**Decision**: Blocking inline script in `<head>` + Tailwind `dark:` class strategy

**Implementation**:
```html
<script>
  // Blocking (intentional): must run before first paint
  const theme = localStorage.getItem('theme') ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

**Rationale**: This is the canonical solution used by shadcn/ui's `ThemeProvider`. The script is small (< 200 bytes), executes synchronously before render, and prevents the white flash. Next.js `next-themes` package also implements this pattern and is available as an alternative if the custom script proves fragile.

**Tailwind config**: `darkMode: 'class'` in `tailwind.config.ts`.

---

## 4. AdSense — CLS-Safe Loading

**Decision**: `next/script strategy="afterInteractive"` + explicit container dimensions

**Pattern**:
```tsx
<div className="min-h-[90px] md:min-h-[90px] w-full">
  <ins className="adsbygoogle" data-ad-slot={AD_SLOTS.HEADER_BANNER.slotId} />
</div>
```

**Rationale**: `afterInteractive` defers the AdSense script until after hydration, ensuring it never blocks TTI. Explicit `min-h` on the container prevents CLS when the ad fills in. The `ins` element is server-rendered (static HTML), so no hydration mismatch.

**Analytics**: Google Analytics 4 loaded via same `next/script strategy="afterInteractive"` pattern. GA4 measurement ID stored in `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var.

---

## 5. Bundle Architecture

**Decision**: Per-route dynamic imports for all heavy modules; shared vendor chunk for React/Next.js core

**Per-route budget enforcement**:
| Route | Estimated initial JS (gzipped) | Heavy deps (dynamic only) |
|---|---|---|
| `/` (homepage) | ~20 KB | none |
| `/checklist` | ~25 KB | @dnd-kit, jspdf, @tanstack/react-virtual, lz-string |
| `/json-formatter` | ~18 KB | JSON tokeniser (lazy), tree view component |
| `/cron-generator` | ~15 KB | cronstrue, cron-parser |
| `/diff-checker` | ~18 KB | diff package |
| `/jwt-decoder` | ~10 KB | none (manual decode) |
| `/regex-tester` | ~20 KB | regex explainer tokeniser (lazy) |

**Shared vendor chunk** (loaded once, cached): React, React-DOM, Next.js runtime, Tailwind base, shadcn primitives ≈ 75 KB gzipped.

---

## 6. TypeScript Configuration

**Decision**: Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

**tsconfig.json additions**:
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

**Impact**: `noUncheckedIndexedAccess` means all array accesses return `T | undefined` — requires explicit null checks on array indexing. This is intentional and catches a common source of runtime errors in checklist and diff logic.

---

## 7. Testing Stack

**Decision**: Vitest (unit) + Playwright (E2E)

**Rationale**:
- Vitest: Vite-based, compatible with Next.js project setup, ~5× faster than Jest for this project size. Native TypeScript support.
- Playwright: Industry standard for Next.js E2E. Can test at multiple viewport sizes (375px mobile, 1280px desktop). Supports dark mode simulation via `colorScheme` option.

**Unit test targets**: All `lib/tools/*.ts` files — pure functions with no DOM/React dependencies.
**E2E targets**: One smoke test per tool route. Tests: page loads, primary action executes, output is non-empty.

---

## 8. SEO — Structured Data Patterns

**Decision**: Inline `<script type="application/ld+json">` in each tool's Server Component page shell

**SoftwareApplication schema per tool**:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{Tool Name}",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://devtools.suite/{slug}",
  "description": "{150-char description}"
}
```

**FAQPage schema** (injected alongside SoftwareApplication, not nested):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

---

## 9. Keyboard Shortcut System

**Decision**: Custom `useKeyboardShortcut` hook using `useEffect` + `addEventListener` on `document`

**Rationale**: No library needed. Shortcuts are scoped: global shortcuts (`Ctrl+D` for theme) registered in root layout; tool-specific shortcuts registered in each tool's client component.

**Focus management**: Checklist uses `useRef` array on item elements + `focus()` calls for arrow-key navigation.

---

## 10. Print Mode Strategy

**Decision**: CSS `@media print` stylesheet injected via Tailwind's `print:` variant

**Pattern**: Tool pages include print-only overrides: `print:hidden` on nav, ads, footer, toolbar. `print:block` on checklist content. No JavaScript required for print triggering — standard `window.print()`.

---

## 11. Resolved Clarifications

All items from the spec were fully specified. No NEEDS CLARIFICATION markers were present. The following were confirmed via research:

| Question | Resolution |
|---|---|
| JWT decode library? | Manual decode — no library needed |
| JSON syntax highlighter? | Custom tokeniser — avoids Prism.js bundle cost |
| Diff library? | `diff` npm package (not `diff-match-patch`) |
| Cron next-execution library? | `cron-parser` (fallback: `croner`) |
| Regex explainer approach? | Custom rule-based tokeniser |
| No-FOUC theme strategy? | Blocking inline `<head>` script |
