# DevTools Suite — Product Specification

> **Status:** Draft v1.0 — 2026-05-23
> **Governed by:** CONSTITUTION.md (all constraints therein apply unconditionally)

---

## 0. Product Identity

| Field | Value |
|---|---|
| Product name | DevTools Suite |
| Domain pattern | `devtools.suite` / TBD |
| Tagline | *The developer toolkit that respects your time.* |
| Primary audience | Developers, release managers, QA engineers, PMs, technical users |
| Core promise | Instant, private, beautiful tools — no login, no lag, no noise |

### Positioning
| This is | This is NOT |
|---|---|
| A premium developer productivity toolkit | A generic utility website |
| Modern, fast, elegant, workflow-focused | A cluttered, ad-heavy converter site |
| Faster than AI chat for routine tasks | A replacement for full IDE tooling |
| Cleaner than every existing competitor | Feature-bloated |

### Competitive advantages
- Superior UX and visual design
- Sub-1-second interactions (all processing is local)
- Keyboard-first workflows with consistent shortcuts
- Dark mode as a first-class feature, not an afterthought
- Mobile-responsive across all tools
- Privacy-first: zero data leaves the browser
- Optimized for repeat/bookmark usage

---

## 1. URL Structure & Routes

```
/                          → Homepage — tool directory + search
/checklist                 → Flagship: Smart Checklist
/json-formatter            → JSON Formatter & Validator
/cron-generator            → Cron Expression Generator
/diff-checker              → Text & JSON Diff Checker
/jwt-decoder               → JWT Decoder & Inspector
/regex-tester              → Regex Tester & Explainer
/about                     → About page
/privacy                   → Privacy policy
/terms                     → Terms of use
```

> **Route decision**: Flat top-level routes (not nested under `/tools/`) for shorter URLs, shallower crawl depth, and cleaner sharing. The homepage at `/` serves as the tool directory.

---

## 2. Homepage

### Purpose
Showcase all tools, establish brand identity, drive SEO traffic for category-level keywords.

### Layout (desktop)
```
┌─────────────────────────────────────────────────────┐
│  Nav: Logo | Tool search bar | Dark/Light toggle    │
├─────────────────────────────────────────────────────┤
│  Hero: Headline + subheadline + search              │
├─────────────────────────────────────────────────────┤
│  [Ad: Header Banner 728×90]                         │
├─────────────────────────────────────────────────────┤
│  Category: Productivity                             │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ Smart Check. │ │ Diff Checker │                  │
│  └──────────────┘ └──────────────┘                  │
│  Category: Data & Format                            │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ JSON Format. │ │ JWT Decoder  │                  │
│  └──────────────┘ └──────────────┘                  │
│  Category: Developer Utilities                      │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ Cron Gen.    │ │ Regex Tester │                  │
│  └──────────────┘ └──────────────┘                  │
├─────────────────────────────────────────────────────┤
│  Footer: links, tagline, copyright                  │
└─────────────────────────────────────────────────────┘
```

### Tool card fields
- Tool name
- One-line description
- Primary keyword badge
- Arrow/CTA to open tool
- Keyboard shortcut hint (if applicable)

### Homepage SEO
- `title`: "DevTools Suite — Free Online Developer Tools"
- `description`: "A modern suite of free developer tools: JSON formatter, cron generator, diff checker, JWT decoder, regex tester, and smart checklist. Fast, private, no login required."
- H1: "Free Developer Tools for Modern Workflows"

---

## 3. Shared UI System

### 3.1 Layout Shell (every tool page)
```
┌─────────────────────────────────────────────────────┐
│  Nav: Logo | Breadcrumb | Search | Theme toggle     │
├─────────────────────────────────────────────────────┤
│  [Ad: Header Banner — 728×90 / 320×50 mobile]       │
├────────────────────────────┬────────────────────────┤
│                            │  [Ad: Sidebar 300×250] │
│  Tool workspace            │  (collapsed on mobile) │
│                            │                        │
│                            │                        │
├────────────────────────────┴────────────────────────┤
│  [Ad: In-content responsive]                        │
├─────────────────────────────────────────────────────┤
│  SEO content: H1, description, FAQ                  │
├─────────────────────────────────────────────────────┤
│  Footer                                             │
└─────────────────────────────────────────────────────┘
```

### 3.2 Toolbar Pattern (reused across all tools)
Every tool has a sticky toolbar with:
- Primary action button (format / run / decode / etc.)
- Copy to clipboard
- Clear / Reset
- Download (where applicable)
- Share URL (where applicable)
- Keyboard shortcut legend (? icon → modal)

### 3.3 Keyboard Shortcuts (global)
| Shortcut | Action |
|---|---|
| `Ctrl+Enter` / `Cmd+Enter` | Execute primary action |
| `Ctrl+Shift+C` | Copy output |
| `Ctrl+Shift+X` | Clear all |
| `?` | Toggle keyboard shortcut help modal |
| `Ctrl+D` / `Cmd+D` | Toggle dark/light mode |

### 3.4 Shared Components
- `ToolLayout` — wraps every tool, injects ads, SEO shell
- `Toolbar` — sticky action bar
- `CopyButton` — clipboard with animated confirmation
- `DownloadButton` — triggers file download
- `ShareButton` — encodes state to URL, copies link
- `KeyboardShortcutModal` — `?` triggered overlay
- `ThemeProvider` — dark/light with localStorage + no-FOUC script
- `AdSlot` — renders AdSense unit with explicit dimensions

---

## 4. Tool Specifications

---

### 4.1 Smart Checklist Tool (FLAGSHIP)

**Route:** `/checklist`

**Purpose:** Convert any pasted text into an interactive, stateful checklist workspace for release management, QA, and deployment workflows.

#### Input Parsing
| Input format | Example | Behavior |
|---|---|---|
| Newline-separated | `Task A\nTask B` | Split on `\n` |
| Comma-separated | `Task A, Task B` | Split on `,` |
| Tab-separated | `Task A\tTask B` | Split on `\t` |
| Mixed | `A, B\nC\tD` | Normalize all separators |
| Auto-clean | `\n\n Task A \n\n` | Trim whitespace, remove blanks |
| With existing markers | `[x] Deploy`, `[?] Verify`, `[ ] Rollback` | Pre-populate state |
| Numbered lists | `1. Deploy\n2. Verify` | Strip numbers, preserve order |
| Bullet lists | `- Deploy\n* Verify` | Strip markers, preserve order |

#### Item States
| State | Visual | Keyboard |
|---|---|---|
| `unchecked` | Empty checkbox | `Space` |
| `checked` | Filled checkbox + strikethrough | `Space` again |
| `invalid` | Red X + red text | `X` key |

#### Features — Core
- **Progress bar:** `{checked}/{total}` with animated fill, turns green at 100%
- **Keyboard navigation:** Arrow keys move focus, Space/X toggle state
- **Drag-and-drop reorder:** `@dnd-kit/core` (dynamically imported)
- **Search/filter:** Live filter input hides non-matching items, clears with Escape
- **Persistence:** Auto-save to `localStorage` on every state change; restores on page load
- **Bulk operations:** Select all, check all, uncheck all, delete checked

#### Features — Export & Share
- **Print mode:** `window.print()` with print-only CSS — clean layout, no chrome
- **PDF export:** `jspdf` (dynamically imported) — generates from current list state
- **Shareable URL:** LZ-string compress list state → base64 → URL param `?c=`; copy button with confirmation toast
- **Export formats:** Plain text (one per line), Markdown checkboxes (`- [x] item`), CSV

#### Performance
- Virtualize lists > 200 items using `@tanstack/react-virtual` (dynamically imported)
- Debounce search input 150 ms
- localStorage write debounced 300 ms

#### SEO
- `title`: "Smart Checklist Tool — Free Online Interactive Checklist Maker"
- `description`: "Create interactive checklists from any text. Paste tasks, logs, or items and get a trackable checklist with progress tracking, drag-and-drop, dark mode, and PDF export. Free, no login."
- Target keywords: online checklist tool, printable checklist maker, developer checklist tool, release checklist, QA checklist tool
- H1: "Smart Online Checklist Maker for Developers & Teams"

#### FAQ entries (SEO content)
1. How do I create a checklist from a list of tasks?
2. Can I save my checklist and return to it later?
3. How do I share a checklist with my team?
4. Does the tool work offline?
5. Can I export my checklist to PDF?

---

### 4.2 JSON Formatter & Validator

**Route:** `/json-formatter`

#### Features
| Feature | Detail |
|---|---|
| Prettify | Indent with 2 or 4 spaces (toggle) |
| Minify | Single line, no whitespace |
| Validate | Real-time error with line/col number + message |
| Syntax highlight | Token-colored output using CSS custom properties (no heavy libs) |
| Tree view | Collapsible JSON tree (dynamically imported component) |
| Copy output | One-click copy with toast |
| Download | `.json` file download |
| Large JSON | Stream-parse in chunks; warn if > 1 MB; disable tree view > 5 MB |
| Sort keys | Optional alphabetical sort of object keys |
| URL decode | Auto-detect and decode URL-encoded JSON strings |

#### Input methods
- Paste text directly into editor
- Upload `.json` file (drag-and-drop or file picker)

> **Removed**: URL fetch input — violates the no-`fetch()` architecture constraint (CONSTITUTION §2.1). All processing must be local.

#### Editor
- `textarea` with monospace font — no heavy editor dependency by default
- Line numbers via CSS counter
- Error gutter: red border + error message below editor

#### Performance
- Parse with `JSON.parse()` — native, instant for typical payloads
- For > 500 KB: run in Web Worker to avoid main thread block
- Syntax highlighting: lightweight custom tokenizer, NOT a full syntax highlighter library

#### SEO
- `title`: "JSON Formatter & Validator — Beautify and Validate JSON Online"
- `description`: "Format, validate, and beautify JSON online. Prettify or minify JSON, view syntax errors with line numbers, collapse tree nodes, and download formatted output. Free & private."
- Target keywords: json formatter online, json validator, json beautifier
- H1: "JSON Formatter, Validator & Beautifier Online"

---

### 4.3 Cron Expression Generator

**Route:** `/cron-generator`

#### Visual Builder
Five fields: Minute | Hour | Day of Month | Month | Day of Week

Each field has:
- Text input for raw value
- Visual picker (click to toggle values for common options)
- Wildcard / range / step / list toggles

#### Output formats
| Format | Example |
|---|---|
| Unix / Linux cron | `0 9 * * 1-5` |
| AWS EventBridge | `cron(0 9 ? * MON-FRI *)` |
| Spring `@Scheduled` | `@Scheduled(cron = "0 0 9 * * MON-FRI")` |
| Quartz cron | `0 0 9 ? * MON-FRI` |
| Human readable | "At 9:00 AM, Monday through Friday" |

#### Features
- **Next 5 executions:** Computed in-browser, displayed as list with relative time
- **Presets library:** Common schedules (every minute, hourly, daily, weekly, monthly, weekdays only, etc.) as clickable chips
- **Reverse parse:** Paste an existing cron expression to load it into the builder
- **Copy all formats:** One-click copy of any output format
- **Timezone display:** Note that cron is timezone-dependent; show UTC by default

#### SEO
- `title`: "Cron Expression Generator — Visual Cron Builder & Parser Online"
- `description`: "Build and validate cron expressions visually. Supports Unix cron, AWS EventBridge, Spring @Scheduled, and Quartz. See next 5 execution times and get a human-readable schedule. Free."
- Target keywords: cron expression generator, cron builder, cron parser
- H1: "Visual Cron Expression Generator and Parser"

---

### 4.4 Diff Checker

**Route:** `/diff-checker`

#### Modes
| Mode | Description |
|---|---|
| Text diff (line) | Side-by-side or unified, colored line diff |
| Text diff (character) | Intra-line character-level diff highlights |
| JSON diff | Parse both sides as JSON, structural diff ignoring key order |

#### Layout
- Side-by-side: two panes with synchronized scrolling, line numbers, diff gutter
- Unified: single pane with +/- prefixes and color coding
- Toggle between modes without losing content

#### Input methods
- Direct paste into each pane
- File upload (drag-and-drop) for either side
- Syntax detection: auto-detect JSON and switch to JSON diff mode

#### Features
- Line count and diff summary (N lines added, M lines removed)
- Copy diff as patch format
- Download diff as `.diff` file
- Ignore whitespace toggle
- Ignore case toggle
- Real-time diff as you type (debounced 200 ms)

#### Implementation note
Use `diff` npm package (pure JS, < 20 KB gzipped) — dynamically imported.

#### SEO
- `title`: "Text Diff Checker — Compare Two Texts or JSON Side by Side Online"
- `description`: "Compare two texts or JSON files side by side. Highlight line differences, character changes, and structural JSON diffs. Free online diff tool with file upload support."
- Target keywords: text diff checker, compare text online, json diff tool
- H1: "Online Text and JSON Diff Checker"

---

### 4.5 JWT Decoder & Inspector

**Route:** `/jwt-decoder`

#### Features
- Paste JWT → instant decode of header, payload, signature sections
- **Header panel:** Formatted JSON, algorithm badge (HS256, RS256, etc.)
- **Payload panel:** Formatted JSON with special claim annotations:
  - `exp` → decoded date + relative time ("expires in 2 hours" / "EXPIRED 3 days ago")
  - `iat` → issued at date
  - `nbf` → not before date
  - `sub`, `iss`, `aud` → labeled fields
- **Signature panel:** Indicator that signature is NOT verified (client-side only), with explanation
- Copy header JSON, copy payload JSON, copy full formatted output
- Token parts colored differently (header.payload.signature in the raw view)
- Expiry status badge: `VALID` (green) / `EXPIRED` (red) / `NOT YET VALID` (yellow)
- Token stats: issued N ago, expires in N / expired N ago, total age

#### Security note (visible in UI)
> "This tool decodes JWTs locally in your browser. The signature is NOT cryptographically verified. Never share JWTs containing sensitive data."

#### SEO
- `title`: "JWT Decoder — Decode and Inspect JWT Tokens Online"
- `description`: "Decode JWT tokens instantly in your browser. View header, payload, expiry, issued-at, and all standard claims. 100% client-side — your token never leaves your device."
- Target keywords: jwt decoder, decode jwt token, jwt inspector
- H1: "JWT Token Decoder and Inspector"

---

### 4.6 Regex Tester & Explainer

**Route:** `/regex-tester`

#### Features
| Feature | Detail |
|---|---|
| Live matching | Highlight all matches in test string as you type (debounced 100 ms) |
| Flags | Checkboxes for `g`, `i`, `m`, `s`, `u`, `y` |
| Match list | All matches shown with index, value, and capture groups |
| Replace mode | Input a replacement string, preview replaced output live |
| Test cases | Add multiple test strings, each shows match/no-match indicator |
| Syntax highlighting | Color the regex pattern by group/quantifier/anchor/etc. |
| Error handling | Show descriptive error for invalid regex with position |
| Explain regex | Expand regex into plain-English description of each token |

#### Regex explanation engine
Built-in tokenizer that produces human-readable output:
- `/^[a-z]+\d{2,4}$/i` → "Start of string, one or more lowercase letters (a–z) (case-insensitive), followed by 2 to 4 digits, end of string"
- Pure client-side, no AI calls required for v1

#### Future enhancement
- Optional AI-assisted explanation via client-side model (not in v1)
- Common regex library: email, URL, phone, date, IP address, semver, etc. (preset gallery)

#### SEO
- `title`: "Regex Tester — Test, Debug & Explain Regular Expressions Online"
- `description`: "Test and debug regular expressions online with live match highlighting. Supports all JS regex flags, capture groups, replace preview, and plain-English regex explanations. Free."
- Target keywords: regex tester online, regex checker, regex validator, regular expression tester
- H1: "Online Regex Tester, Debugger & Explainer"

---

## 5. SEO Content Requirements (all tools)

Every tool page at `/[slug]` must include these static sections below the tool workspace:

### 5.1 Tool Description Block (150–300 words)
- Placed in a visually clean section below the ads
- Explains what the tool does, who it's for, and why it's useful
- Naturally incorporates primary + secondary keywords
- Written for humans first, search engines second

### 5.2 FAQ Section
- Minimum 5 questions per tool
- `FAQPage` JSON-LD schema injected in `<head>`
- Accordion UI using shadcn `Accordion` component
- Questions target long-tail search queries

### 5.3 Structured Data (every tool)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{Tool Name}",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "{meta description}",
  "url": "https://{domain}/{slug}"
}
```

### 5.4 Open Graph & Twitter Card (every tool)
```typescript
openGraph: {
  title: string,       // same as page title
  description: string, // same as meta description
  type: 'website',
  url: canonicalUrl,
  images: [{ url: '/og/{slug}.png', width: 1200, height: 630 }]
},
twitter: {
  card: 'summary_large_image',
  title: string,
  description: string,
  images: ['/og/{slug}.png']
}
```

OG images: Static pre-generated PNG per tool (1200×630), one per route slug (e.g. `/og/checklist.png`). Generated at build time; no runtime OG generation required for v1.

---

## 6. Monetization — AdSense Implementation

### Slot definitions (`lib/ads-config.ts`)
```typescript
export const AD_SLOTS = {
  HEADER_BANNER: {
    slotId: 'REPLACE_WITH_ADSENSE_SLOT_ID',
    format: 'horizontal',        // 728x90 desktop / 320x50 mobile
  },
  SIDEBAR:  {
    slotId: 'REPLACE_WITH_ADSENSE_SLOT_ID',
    format: 'rectangle',         // 300x250
  },
  IN_CONTENT: {
    slotId: 'REPLACE_WITH_ADSENSE_SLOT_ID',
    format: 'responsive',
  },
} as const
```

### Load strategy
```tsx
// app/layout.tsx
<Script
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  strategy="afterInteractive"
  data-ad-client="ca-pub-REPLACE_WITH_PUBLISHER_ID"
/>
```

### CLS prevention
Each `AdSlot` container has `min-height` matching the ad unit height set via Tailwind:
- Header banner: `min-h-[50px] md:min-h-[90px]`
- Sidebar: `min-h-[250px]`
- In-content: `min-h-[100px]`

---

## 7. Performance Budget

| Asset | Budget |
|---|---|
| Per-route JS (gzipped) | ≤ 50 KB |
| Shared vendor chunk | ≤ 80 KB |
| Total page weight (HTML+CSS+JS, excl. ads) | ≤ 200 KB |
| Time to Interactive (TTI) | < 1.0 s (throttled 4×) |
| Tool execution time | < 200 ms for typical input |
| LCP | < 1.2 s |
| CLS | < 0.05 |

### Dynamic import candidates
| Library | Trigger |
|---|---|
| `@dnd-kit/core` | User initiates drag |
| `jspdf` | User clicks "Export PDF" |
| `@tanstack/react-virtual` | List > 200 items |
| `diff` | First input change in either diff pane |
| Tree view component | User toggles tree view |

---

## 8. Accessibility Requirements

- All interactive elements have `aria-label` or visible label
- Color is never the sole differentiator (checked/invalid states also use icons)
- Focus is always visible (Tailwind `focus-visible:ring-2`)
- `prefers-reduced-motion` respected — all CSS transitions and animations are disabled when the user's OS motion preference is `reduce`; apply `motion-safe:` Tailwind variant on every animated element
- Keyboard-navigable without mouse for all core workflows
- WCAG 2.1 AA minimum

---

## 9. Project File Structure

```
devtools-suite/
├── app/
│   ├── layout.tsx                    # Root: ThemeProvider, AdSense script, global nav, footer
│   ├── page.tsx                      # Homepage
│   ├── globals.css
│   ├── robots.ts                     # next/metadata robots
│   ├── sitemap.ts                    # next/metadata sitemap
│   ├── checklist/
│   │   ├── page.tsx                  # generateMetadata + ToolLayout wrapper
│   │   ├── loading.tsx               # Skeleton
│   │   └── _components/
│   │       └── ChecklistTool.tsx
│   ├── json-formatter/
│   ├── cron-generator/
│   ├── diff-checker/
│   ├── jwt-decoder/
│   ├── regex-tester/
│   ├── about/
│   ├── privacy/
│   └── terms/
├── components/
│   ├── ui/                           # shadcn primitives
│   └── shared/
│       ├── ToolLayout.tsx
│       ├── Toolbar.tsx
│       ├── AdSlot.tsx
│       ├── CopyButton.tsx
│       ├── DownloadButton.tsx
│       ├── ShareButton.tsx
│       ├── ThemeProvider.tsx
│       ├── KeyboardShortcutModal.tsx
│       ├── Nav.tsx
│       └── Footer.tsx
├── lib/
│   ├── ads-config.ts
│   ├── utils.ts                      # cn() + misc helpers
│   └── tools/
│       ├── checklist.ts              # Pure TS: parse, state, encode/decode
│       ├── json-formatter.ts         # Pure TS: format, validate, tokenize
│       ├── cron-generator.ts         # Pure TS: build, explain, next-runs
│       ├── diff-checker.ts           # Pure TS: diff wrapper
│       ├── jwt-decoder.ts            # Pure TS: decode, annotate claims
│       └── regex-tester.ts           # Pure TS: match, explain
├── public/
│   └── og/                           # Static OG images per tool
├── CONSTITUTION.md
├── SPEC.md
└── package.json
```

---

## 10. Build & Deploy

### Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run test         # Vitest unit tests
npm run e2e          # Playwright smoke tests
npm run lighthouse   # Lighthouse CI (post-build)
npm run analyze      # Bundle analyzer
```

### CI gates (all must pass before merge to main)
1. `npm run type-check` — zero TS errors
2. `npm run lint` — zero ESLint errors
3. `npm run test` — all unit tests pass
4. `npm run e2e` — all smoke tests pass
5. Lighthouse CI — all 4 categories ≥ 95 on every route
6. Bundle size check — no route exceeds 50 KB JS budget

### Vercel deployment
- Auto-deploy on push to `main`
- Preview deployments on PRs
- Static generation: all tool pages use `generateStaticParams` (empty — no dynamic segments)
- Edge runtime not required (all static)

---

## 11. Implementation Order

Build in this sequence to ship value incrementally:

1. **Project scaffold** — Next.js 14 + TS + Tailwind + shadcn init, CONSTITUTION-compliant config
2. **Shared system** — ThemeProvider, Nav, Footer, ToolLayout, AdSlot, Toolbar, CopyButton
3. **Homepage** — Tool grid, search, SEO metadata
4. **Smart Checklist** (flagship) — Full feature set per §4.1
5. **JSON Formatter** — per §4.2
6. **JWT Decoder** — per §4.5 (small scope, high value)
7. **Regex Tester** — per §4.6
8. **Cron Generator** — per §4.3
9. **Diff Checker** — per §4.4
10. **SEO polish** — OG images, FAQ content, structured data audit
11. **Performance audit** — Lighthouse CI, bundle analysis, Web Worker offloads
12. **AdSense integration** — Slot IDs wired up, CLS verified
