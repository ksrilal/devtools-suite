# Tasks: DevTools Suite Platform

**Input**: Design documents from `specs/001-devtools-suite-platform/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: Unit tests included for all `lib/tools/` pure functions (per CONSTITUTION.md §7.3). E2E smoke tests included per tool. No UI snapshot tests.

**Organization**: Tasks are grouped by user story (persona + tool) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other [P] tasks in the same phase
- **[Story]**: Maps to user story / persona from spec.md
- No story label = infrastructure/foundation task

---

## Phase 1: Setup (Project Scaffold)

**Purpose**: Bootstrap the Next.js 14 project with all configuration, tooling, and dependencies. Nothing else can start until this is complete.

- [X] T001 Initialise Next.js 14 App Router project with TypeScript: `npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"` in `devtools-suite/`
- [X] T002 Extend `tsconfig.json` with strict flags: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- [X] T003 Run `npx shadcn-ui@latest init` with Slate base colour and CSS variables enabled; output to `components/ui/`
- [X] T004 [P] Install all required shadcn/ui components: Button, Input, Textarea, Select, Tabs, Accordion, Dialog, Toast, Badge, Progress, Collapsible, Tooltip, ScrollArea, Label, Switch, Separator
- [X] T005 [P] Install runtime dependencies: `lz-string`, `diff`, `cronstrue`, `cron-parser`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@tanstack/react-virtual`, `jspdf`
- [X] T006 [P] Install dev dependencies: `vitest`, `@vitest/ui`, `jsdom`, `@vitejs/plugin-react`, `@playwright/test`, `@next/bundle-analyzer`, `husky`, `lint-staged`, `prettier`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- [X] T007 Create `vitest.config.ts` with jsdom environment, globals, and path alias `@/*` → project root per `quickstart.md`
- [X] T008 Create `playwright.config.ts` targeting `localhost:3000`; configure two projects: desktop (1280×800) and mobile (375×812)
- [X] T009 Configure `tailwind.config.ts`: set `darkMode: 'class'`, add `tailwindcss-animate` plugin, add all content paths for `app/`, `components/`, `lib/`
- [X] T010 [P] Configure ESLint with `eslint-config-next` and `@typescript-eslint/recommended-type-checked`
- [X] T011 [P] Configure Prettier and `.prettierrc`; add `format` script to `package.json`
- [ ] T012 Run `npx husky init`; set pre-commit hook to `npx lint-staged`; create `.lintstagedrc.js` running ESLint + Prettier on `**/*.{ts,tsx}` and Prettier on `**/*.{json,md,css}`
- [X] T013 Create `.env.example` with `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` and `NEXT_PUBLIC_GA_MEASUREMENT_ID` placeholders; add `.env.local` to `.gitignore`
- [X] T014 Add all npm scripts to `package.json`: `type-check`, `test`, `test:watch`, `test:ui`, `e2e`, `e2e:ui`, `analyze`, `lighthouse` per `quickstart.md`

**Checkpoint**: `npm run dev` starts without errors; `npm run type-check` passes; shadcn components importable.

---

## Phase 2: Foundational (Shared Platform Shell)

**Purpose**: Shared infrastructure consumed by every tool page. All tool phases depend on this being complete first.

**⚠️ CRITICAL**: No tool work can begin until this phase is complete.

- [X] T015 Create `lib/utils.ts`: implement `cn()` (clsx + tailwind-merge), `copyToClipboard()`, `downloadFile()`, `readFileAsText()`, `debounce()`, `formatBytes()`, `localStorageGet()`, `localStorageSet()` per contracts/lib-tools-api.md
- [ ] T016 Create `lib/ads-config.ts`: define `ADSENSE_PUBLISHER_ID` constant and `AD_SLOTS` object with `HEADER_BANNER`, `SIDEBAR`, `IN_CONTENT` entries (slot IDs as placeholders) including `minHeightPx` and `minHeightMobilePx` per data-model.md
- [ ] T017 Create `lib/tools-registry.ts`: define `ToolDefinition` type and `TOOLS` array with all 6 tools (slug, name, description, category, keywords, icon name, route) per data-model.md
- [X] T018 Create `lib/seo-helpers.ts`: implement `buildMetadata()` helper returning `Metadata` object with title, description, keywords, canonical, openGraph, twitter; implement `buildSoftwareApplicationLD()` and `buildFAQLD()` returning typed JSON-LD objects per data-model.md
- [X] T019 Create `components/shared/ThemeProvider.tsx` ('use client'): context with `theme`, `setTheme`, `resolvedTheme`; reads/writes `devtools_theme` localStorage key per contracts/ui-component-api.md
- [X] T020 Create `components/shared/ThemeToggle.tsx` ('use client'): sun/moon icon button consuming ThemeProvider context; uses shadcn Button
- [X] T021 Add no-FOUC blocking inline script to `app/layout.tsx` `<head>`: reads `devtools_theme` from localStorage and toggles `dark` class on `<html>` before first paint per research.md
- [X] T022 Create `components/shared/Nav.tsx` (Server Component): logo link to `/`, tool search input island, ThemeToggle island; mobile hamburger menu
- [X] T023 Create `components/shared/Footer.tsx` (Server Component): links to all 6 tools + `/about` + `/privacy` + `/terms`; platform name and copyright
- [X] T024 Create `components/shared/AdSlot.tsx` ('use client'): renders `<ins class="adsbygoogle">` with correct slot ID from `AD_SLOTS`; wraps in a `div` with explicit `min-h-*` classes for CLS prevention; includes `<noscript>` fallback per CONSTITUTION.md §6
- [X] T025 Create `components/shared/ToolLayout.tsx` (Server Component): renders header AdSlot, main content with optional sidebar AdSlot at ≥md, in-content AdSlot below children, SEO content area; accepts `structuredData` prop for JSON-LD injection per contracts/ui-component-api.md
- [ ] T026 Create `components/shared/Toolbar.tsx` ('use client'): sticky action bar with configurable `ToolbarAction[]`; shows shortcut hints; collapses labels on mobile per contracts/ui-component-api.md
- [X] T027 [P] Create `components/shared/CopyButton.tsx` ('use client'): calls `copyToClipboard()` on click; shows animated checkmark confirmation for 2 s per contracts/ui-component-api.md
- [ ] T028 [P] Create `components/shared/DownloadButton.tsx` ('use client'): calls `downloadFile()` on click; accepts `getContent`, `filename`, `mimeType` props per contracts/ui-component-api.md
- [ ] T029 [P] Create `components/shared/ShareButton.tsx` ('use client'): calls `getURL()` prop on click; copies result to clipboard; shows toast confirmation per contracts/ui-component-api.md
- [ ] T030 [P] Create `components/shared/PrivacyNotice.tsx` (Server Component): renders "🔒 {toolName} processes all data locally in your browser. Nothing is sent to any server." per contracts/ui-component-api.md
- [X] T031 [P] Create `components/shared/FAQSection.tsx` (Server Component): renders shadcn Accordion from `FAQItem[]` prop per contracts/ui-component-api.md
- [X] T032 [P] Create `components/shared/ToolDescription.tsx` (Server Component): styled prose wrapper for 150–300 word SEO description content per contracts/ui-component-api.md
- [ ] T033 [P] Create `components/shared/ToolCard.tsx` (Server Component): renders tool name, description badge, keyword chip, and link arrow from `ToolDefinition` prop per contracts/ui-component-api.md
- [ ] T034 Create `components/shared/KeyboardShortcutModal.tsx` ('use client'): Dialog triggered by `?` key globally and by trigger prop; renders `ShortcutEntry[]` table per contracts/ui-component-api.md
- [X] T035 Update `app/layout.tsx`: wrap with ThemeProvider; add GA4 `next/script strategy="afterInteractive"`; add AdSense `next/script strategy="afterInteractive"` with publisher ID; render Nav and Footer; load Geist font via `next/font`
- [X] T036 Create `app/robots.ts`: Next.js metadata route returning `{ rules: { userAgent: '*', allow: '/' }, sitemap: 'https://{domain}/sitemap.xml' }`
- [X] T037 Create `app/sitemap.ts`: Next.js metadata route returning entries for `/`, `/checklist`, `/json-formatter`, `/cron-generator`, `/diff-checker`, `/jwt-decoder`, `/regex-tester`, `/about`, `/privacy`, `/terms`
- [X] T038 Create `app/page.tsx` (homepage): `generateMetadata()` with unique title/description; hero section; tool grid grouped by category using `TOOLS` registry and `ToolCard`; live search/filter client island; header AdSlot per SPEC.md §2
- [X] T039 Create `app/globals.css`: Tailwind directives; print media query hiding nav/ads/toolbar and showing checklist content cleanly; `motion-safe:` pattern comment for animated elements
- [X] T040 [P] Create `app/about/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`: each with unique `generateMetadata()` and static prose content

**Checkpoint**: Homepage renders at `localhost:3000`; dark mode toggles without flash; AdSlot containers reserve space; Nav and Footer present on all pages; `npm run type-check` passes.

---

## Phase 3: User Story 1 — Release Manager / Smart Checklist (Priority: P1) 🎯 MVP

**Goal**: A release manager pastes a list of tasks and gets a stateful, persistent, shareable checklist with progress tracking, drag-and-drop, and export.

**Independent Test**: Navigate to `/checklist`, paste 5 newline-separated items, verify checklist appears; toggle states with Space/X; refresh page and verify state persists; click Share and open the URL in a new tab and verify identical state.

### Implementation

- [X] T041 [US1] Create `lib/tools/checklist.ts`: implement all functions from contracts/lib-tools-api.md — `parseChecklistInput()` (handles newline/comma/tab/mixed/markers/bullets/numbers), `transitionState()`, `filterItems()`, `computeProgress()`, `encodeChecklistToURL()` / `decodeChecklistFromURL()` (lz-string), `exportAsPlainText()`, `exportAsMarkdown()`, `exportAsCSV()`
- [X] T042 [US1] Create `lib/tools/checklist.test.ts`: unit tests for `parseChecklistInput` (all separator types, existing markers, bullet stripping, empty-line cleaning), `transitionState` (all state transitions per data-model.md state diagram), `computeProgress`, `filterItems`, `encodeChecklistToURL`/`decodeChecklistFromURL` round-trip
- [ ] T043 [US1] Create `app/checklist/loading.tsx`: skeleton placeholder with shimmer rows matching the checklist layout
- [X] T044 [US1] Create `app/checklist/page.tsx` (Server Component): `generateMetadata()` with title "Smart Checklist Tool — Free Online Interactive Checklist Maker", description, keywords, canonical `/checklist`, OG image `/og/checklist.png`; inject `SoftwareApplicationLD` + `FAQPageLD` JSON-LD; render ToolLayout + ChecklistTool + PrivacyNotice + ToolDescription + FAQSection per SPEC.md §4.1
- [X] T045 [US1] Create `app/checklist/_components/ChecklistTool.tsx` ('use client'): textarea input area; on submit call `parseChecklistInput()` and initialise workspace; render item list with state icons (empty box / check / red X); `useEffect` debounced 300 ms → `localStorageSet`; on mount read `localStorageGet` and restore workspace; decode `?c=` URL param on mount using `decodeChecklistFromURL()`
- [X] T046 [US1] Add progress bar to `ChecklistTool.tsx`: call `computeProgress()`; render shadcn Progress component; add "100% complete" green visual state
- [X] T047 [US1] Add search/filter to `ChecklistTool.tsx`: controlled input calling `filterItems()` debounced 150 ms; Escape key clears filter; filtered items shown/hidden without removing from state
- [ ] T048 [US1] Add keyboard navigation to `ChecklistTool.tsx`: `useRef` array on item elements; `↑`/`↓` call `focus()`; Space calls `transitionState('toggle')`; `X` calls `transitionState('invalidate')`; `Tab` moves to toolbar buttons
- [ ] T049 [US1] Add drag-and-drop reorder to `ChecklistTool.tsx`: dynamically import `@dnd-kit/core` + `@dnd-kit/sortable`; wrap list in `DndContext` + `SortableContext`; each item is a `useSortable` node; update item order on `onDragEnd`
- [ ] T050 [US1] Add bulk operations to `ChecklistTool.tsx`: "Check all", "Uncheck all", "Delete checked", "Delete invalid" buttons in Toolbar action set
- [X] T051 [US1] Add export actions to `ChecklistTool.tsx`: "Copy as Text" calls `exportAsPlainText()` + `copyToClipboard()`; "Copy as Markdown" calls `exportAsMarkdown()`; "Export CSV" calls `exportAsCSV()` + `downloadFile()`; "Export PDF" dynamically imports `jspdf` on click and renders item list
- [X] T052 [US1] Add Share button to `ChecklistTool.tsx`: calls `encodeChecklistToURL()`, builds full URL with `?c=` param, copies to clipboard via `ShareButton`
- [ ] T053 [US1] Add virtualisation to `ChecklistTool.tsx`: dynamically import `@tanstack/react-virtual`; use `useVirtualizer` when `items.length > 200`; maintain correct scroll height with absolute positioning of rows
- [ ] T054 [US1] Create E2E smoke test `tests/e2e/checklist.spec.ts`: (1) load `/checklist`, paste 3 items, verify 3 rows rendered; (2) click first item checkbox, verify state change and progress update; (3) reload page, verify state persisted; (4) click Share, verify URL contains `?c=`; run at 375 px and 1280 px viewports

**Checkpoint**: `/checklist` fully functional end-to-end; `npm run test` passes all checklist unit tests; `npm run e2e` passes checklist spec at both viewports; Lighthouse ≥ 95 on `/checklist`.

---

## Phase 4: User Story 2 — Backend Developer / JSON Formatter (Priority: P2)

**Goal**: A developer pastes or uploads a JSON string and gets instant formatting with syntax highlighting, validation errors with line/column, tree view, and one-click copy/download.

**Independent Test**: Navigate to `/json-formatter`, paste `{"a":1}`, verify prettified output with syntax highlighting; paste `{bad json`, verify error message shows line and column; toggle tree view; click Copy and verify clipboard; upload a `.json` file and verify it loads.

### Implementation

- [X] T055 [P] [US2] Create `lib/tools/json-formatter.ts`: implement `formatJSON()` (JSON.parse + JSON.stringify with indent), `minifyJSON()`, `tokeniseJSON()` (custom regex tokeniser; HTML-escape all string values before wrapping in `<span>`), `sortJSONKeys()` (recursive), `parseJSONError()` (extract line/col from SyntaxError message) per contracts/lib-tools-api.md
- [X] T056 [P] [US2] Create `lib/tools/json-formatter.test.ts`: unit tests for `formatJSON` (valid input, invalid input with error shape, sort keys), `minifyJSON`, `tokeniseJSON` (verifies all 7 token types, verifies HTML escaping of `<`/`>`/`&` in strings), `parseJSONError` (extracts correct line/col)
- [ ] T057 [US2] Create `app/json-formatter/loading.tsx`: two-column skeleton (input left, output right)
- [X] T058 [US2] Create `app/json-formatter/page.tsx` (Server Component): `generateMetadata()` unique to JSON formatter; `SoftwareApplicationLD` + `FAQPageLD` JSON-LD; ToolLayout + JSONFormatterTool + PrivacyNotice + ToolDescription + FAQSection per SPEC.md §4.2
- [X] T059 [US2] Create `app/json-formatter/_components/JSONFormatterTool.tsx` ('use client'): textarea input with monospace font; Format (`Ctrl+Enter`) calls `formatJSON()`; Minify calls `minifyJSON()`; Sort Keys toggle; indent size toggle (2/4 spaces); error display below input with line/col; syntax-highlighted output using `tokeniseJSON()` with `dangerouslySetInnerHTML`; Toolbar with Copy, Download (`.json`), Clear; file drag-and-drop and file picker calling `readFileAsText()`; size warning at > 1 MB
- [ ] T060 [US2] Create `app/json-formatter/_components/JSONTreeView.tsx` ('use client'): recursive component rendering collapsible nodes using shadcn Collapsible; string/number/boolean/null leaf values with type colours; expand/collapse all button; this component is dynamically imported — do NOT import it directly in JSONFormatterTool
- [ ] T061 [US2] Wire tree view toggle in `JSONFormatterTool.tsx`: `const JSONTreeView = dynamic(() => import('./JSONTreeView'), { ssr: false, loading: () => <Skeleton /> })`; Tree View tab disabled when input > 5 MB
- [ ] T062 [US2] Create E2E smoke test `tests/e2e/json-formatter.spec.ts`: (1) paste valid JSON, press `Ctrl+Enter`, verify output is formatted; (2) paste `{bad}`, verify error with line/column visible; (3) click Copy, verify no error thrown; (4) toggle tree view, verify tree renders; run at 375 px and 1280 px

**Checkpoint**: `/json-formatter` fully functional; unit tests pass; E2E passes; Lighthouse ≥ 95; route JS ≤ 50 KB gzipped.

---

## Phase 5: User Story 3 — Backend Developer / JWT Decoder (Priority: P2)

**Goal**: A developer pastes a JWT token and instantly sees decoded header, payload with annotated claims, expiry status, and can copy sections — all without any network request.

**Independent Test**: Navigate to `/jwt-decoder`, paste a valid JWT, verify three panels render; verify `exp` claim shows relative time; verify privacy notice is visible; paste `notajwt`, verify error message.

### Implementation

- [X] T063 [P] [US3] Create `lib/tools/jwt-decoder.ts`: implement `decodeJWT()` (manual base64url decode with `atob`, no library); `getExpiryStatus()` (compare `exp` to `Date.now()/1000`); `formatRelativeTime()` (e.g. "in 23 minutes", "expired 3 days ago"); `annotateStandardClaims()` (label exp/iat/nbf/sub/iss/aud/jti) per contracts/lib-tools-api.md and research.md
- [X] T064 [P] [US3] Create `lib/tools/jwt-decoder.test.ts`: unit tests for `decodeJWT` (valid JWT, malformed input returns null, 2-part token returns null), `getExpiryStatus` (future exp → valid, past exp → expired, missing exp → no_expiry, future nbf → not_yet_valid), `formatRelativeTime` (seconds, minutes, hours, days boundaries), `annotateStandardClaims` (all standard claims labelled, unknown claims pass through)
- [ ] T065 [US3] Create `app/jwt-decoder/loading.tsx`: three-panel skeleton
- [X] T066 [US3] Create `app/jwt-decoder/page.tsx` (Server Component): `generateMetadata()` unique to JWT decoder; JSON-LD; ToolLayout + JWTDecoderTool + PrivacyNotice + ToolDescription + FAQSection per SPEC.md §4.5
- [X] T067 [US3] Create `app/jwt-decoder/_components/JWTDecoderTool.tsx` ('use client'): textarea for token input (auto-decodes on paste via `onChange`); raw token view with three segments colour-coded; Header panel with algorithm badge and formatted JSON; Payload panel with `annotateStandardClaims()` output, each claim on its own row with label; expiry status badge (`VALID`/`EXPIRED`/`NOT YET VALID`/`NO EXPIRY`) with appropriate colour; Signature panel with non-verification notice; copy buttons for header JSON, payload JSON, full output; error state for malformed input; PrivacyNotice rendered
- [ ] T068 [US3] Create E2E smoke test `tests/e2e/jwt-decoder.spec.ts`: (1) paste a valid JWT (use a test token with known exp), verify all three panels render and expiry badge shows; (2) paste `notajwt`, verify error message; (3) verify privacy notice text is visible; run at 375 px and 1280 px

**Checkpoint**: `/jwt-decoder` fully functional; unit tests pass; E2E passes; Lighthouse ≥ 95; no network requests in DevTools during token decode.

---

## Phase 6: User Story 4 — DevOps Engineer / Cron Generator (Priority: P2)

**Goal**: A DevOps engineer builds a cron expression using a visual field editor, sees human-readable output and next 5 execution times, and copies it in Unix, AWS EventBridge, Spring, or Quartz format.

**Independent Test**: Navigate to `/cron-generator`, click the "Weekdays at 9am" preset, verify fields show `0 9 * * 1-5`, verify human-readable text shows "At 09:00 AM, Monday through Friday", verify 5 execution times are listed, copy EventBridge format and verify it starts with `cron(`.

### Implementation

- [X] T069 [P] [US4] Create `lib/tools/cron-generator.ts`: implement `validateCronField()`, `buildExpression()`, `parseExpression()`, `toEventBridge()` (replace `*` dom/dow conflict with `?`, append year `*`), `toSpringScheduled()` (prepend `0` seconds field), `toQuartz()` (prepend `0` seconds field), `getNextExecutions()` (dynamically imports `cron-parser` inside the function body) per contracts/lib-tools-api.md; export `CRON_PRESETS` array per data-model.md
- [ ] T070 [P] [US4] Create `lib/tools/cron-generator.test.ts`: unit tests for `validateCronField` (valid wildcards, ranges, steps, lists; invalid values), `buildExpression` (assembles 5 fields correctly), `parseExpression` (parses back correctly), `toEventBridge` (correct `?` placement and year field), `toSpringScheduled` (seconds prepended), `toQuartz` (seconds prepended)
- [ ] T071 [US4] Create `app/cron-generator/loading.tsx`: visual builder skeleton with 5 field placeholders
- [X] T072 [US4] Create `app/cron-generator/page.tsx` (Server Component): `generateMetadata()` unique to cron generator; JSON-LD; ToolLayout + CronGeneratorTool + ToolDescription + FAQSection per SPEC.md §4.3
- [X] T073 [US4] Create `app/cron-generator/_components/CronGeneratorTool.tsx` ('use client'): five labelled field inputs (Minute, Hour, Day of Month, Month, Day of Week); each field validates live via `validateCronField()` with red border + message on error; raw expression input that calls `parseExpression()` on change to sync fields; human-readable interpretation (dynamically import `cronstrue` inside render effect); next 5 executions list calling `getNextExecutions(5)` with UTC timestamp + relative time; four copy buttons for Unix/EventBridge/Spring/Quartz formats; presets chip gallery (10 presets from `CRON_PRESETS`) that sets all fields on click
- [ ] T074 [US4] Create E2E smoke test `tests/e2e/cron-generator.spec.ts`: (1) click "Weekdays at 9am" preset, verify expression field shows `0 9 * * 1-5`; (2) verify human-readable text contains "9:00 AM"; (3) verify 5 execution rows are rendered; (4) click copy EventBridge, verify no error; run at 375 px and 1280 px

**Checkpoint**: `/cron-generator` fully functional; unit tests pass; E2E passes; Lighthouse ≥ 95; no invalid expression possible via visual builder.

---

## Phase 7: User Story 5 — Developer / Regex Tester (Priority: P3)

**Goal**: A developer types a regex pattern, sees live match highlighting in test strings, reviews all match groups, previews replacements, adds multiple test cases, and gets a plain-English explanation of the pattern.

**Independent Test**: Navigate to `/regex-tester`, type `\d+` in pattern, type `abc 123 def` in test input, verify `123` is highlighted; toggle `i` flag, verify case change propagates; click Explain, verify plain-English description renders; add a second test case and verify pass/fail indicator.

### Implementation

- [X] T075 [P] [US5] Create `lib/tools/regex-tester.ts`: implement `compileRegex()` (safe try/catch around `new RegExp()`), `findMatches()` (iterate all matches with groups), `previewReplace()` (call `String.prototype.replace`), `testMatch()` (boolean test), `explainRegex()` (custom rule-based tokeniser producing `RegexToken[]`), `tokeniseRegex()` (produce `RegexSyntaxToken[]` for syntax colouring) per contracts/lib-tools-api.md
- [X] T076 [P] [US5] Create `lib/tools/regex-tester.test.ts`: unit tests for `compileRegex` (valid pattern returns regex, invalid returns error string), `findMatches` (global flag returns all matches, named groups captured), `previewReplace` (replaces correctly), `testMatch` (true/false), `explainRegex` (anchors, quantifiers, groups, char classes each return correct description), `tokeniseRegex` (tokens correctly typed)
- [ ] T077 [US5] Create `app/regex-tester/loading.tsx`: pattern input + test area skeleton
- [X] T078 [US5] Create `app/regex-tester/page.tsx` (Server Component): `generateMetadata()` unique to regex tester; JSON-LD; ToolLayout + RegexTesterTool + ToolDescription + FAQSection per SPEC.md §4.6
- [X] T079 [US5] Create `app/regex-tester/_components/RegexTesterTool.tsx` ('use client'): pattern input with live `tokeniseRegex()` syntax colouring applied via `dangerouslySetInnerHTML` overlay; flag toggle checkboxes (g, i, m, s, u, y); test input textarea with match highlights (wrap each match in `<mark>`) debounced 100 ms; match list showing index, value, capture groups; "Replace" mode tab with replacement string input and live preview via `previewReplace()`; "Test Cases" tab to add multiple strings each with pass/fail badge; "Explain" toggle expanding `RegexToken[]` descriptions; error state for invalid patterns
- [ ] T080 [US5] Create E2E smoke test `tests/e2e/regex-tester.spec.ts`: (1) type `\d+`, type `abc 123`, verify a highlighted match span is visible; (2) type invalid regex `[`, verify error message; (3) click Explain, verify explanation text is non-empty; (4) add a test case, verify pass indicator; run at 375 px and 1280 px

**Checkpoint**: `/regex-tester` fully functional; unit tests pass; E2E passes; Lighthouse ≥ 95; live highlighting latency < 100 ms on typical input.

---

## Phase 8: User Story 6 — Technical PM + Developer / Diff Checker (Priority: P3)

**Goal**: A user pastes or uploads two texts into side-by-side panes, sees colour-coded line and character diffs with a summary, can switch to unified view, and can download the result as a patch file.

**Independent Test**: Navigate to `/diff-checker`, paste `hello world` left and `hello earth` right, verify "world" shown as removed and "earth" as added; verify diff summary shows counts; toggle unified view; click Download and verify `.diff` file; paste valid JSON in both panes and verify JSON diff mode becomes available.

### Implementation

- [ ] T081 [P] [US6] Create `components/shared/SplitPane.tsx` ('use client'): two labelled textarea/div panes side-by-side at ≥ md; each full-width stacked on mobile; `syncScroll` prop attaches `scroll` event listener on each pane and mirrors `scrollTop` to the other; file drag-and-drop on each pane calls `readFileAsText()` per contracts/ui-component-api.md
- [X] T082 [P] [US6] Create `lib/tools/diff-checker.ts`: implement `diffLines()` (dynamically imports `diff` package inside function), `diffChars()`, `diffJSON()` (JSON.parse both sides, stringify with sorted keys, then diffLines), `summariseDiff()`, `formatAsPatch()` per contracts/lib-tools-api.md
- [ ] T083 [P] [US6] Create `lib/tools/diff-checker.test.ts`: unit tests for `diffLines` (additions, removals, equal lines; ignoreWhitespace; ignoreCase), `diffChars` (intra-line changes), `diffJSON` (structural equivalence ignoring key order), `summariseDiff` (correct counts), `formatAsPatch` (output starts with `---`/`+++` headers)
- [ ] T084 [US6] Create `app/diff-checker/loading.tsx`: two-pane skeleton
- [X] T085 [US6] Create `app/diff-checker/page.tsx` (Server Component): `generateMetadata()` unique to diff checker; JSON-LD; ToolLayout + DiffCheckerTool + PrivacyNotice + ToolDescription + FAQSection per SPEC.md §4.4
- [X] T086 [US6] Create `app/diff-checker/_components/DiffCheckerTool.tsx` ('use client'): SplitPane with two inputs; diff computed on input change debounced 200 ms calling `diffLines()`; side-by-side view renders coloured line rows (green added, red removed, neutral equal) with line numbers; "Unified" view tab renders single pane with +/- prefixes; character-level highlighting within changed lines via `diffChars()`; diff summary bar (N added, M removed, K changed); "Ignore whitespace" and "Ignore case" toggles; JSON diff mode auto-enabled when both sides parse as valid JSON; Toolbar: Download (`.diff` via `formatAsPatch()` + `downloadFile()`), Copy diff, Clear both
- [ ] T087 [US6] Create E2E smoke test `tests/e2e/diff-checker.spec.ts`: (1) paste different text in each pane, verify coloured diff rows render; (2) verify diff summary is visible; (3) click Download, verify no error thrown; (4) paste valid JSON in both panes, verify JSON diff mode tab appears; run at 375 px and 1280 px

**Checkpoint**: `/diff-checker` fully functional; unit tests pass; E2E passes; Lighthouse ≥ 95; synchronised scroll works on desktop.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Cross-tool quality gates, SEO finalisation, and production readiness.

- [ ] T088 [P] Generate all 7 OG images (1200×630 PNG) using a design tool or script: `public/og/home.png`, `public/og/checklist.png`, `public/og/json-formatter.png`, `public/og/cron-generator.png`, `public/og/diff-checker.png`, `public/og/jwt-decoder.png`, `public/og/regex-tester.png` — consistent brand colours, tool name, icon
- [ ] T089 [P] Add `prefers-reduced-motion` support: audit all animated elements across `components/shared/` and `app/globals.css`; replace bare `transition-*` and `animate-*` Tailwind classes with `motion-safe:transition-*` and `motion-safe:animate-*` variants per SPEC.md §8 and CONSTITUTION.md §5.3
- [ ] T090 [P] Write FAQ content for all 6 tool pages (minimum 5 Q&A pairs each); add to respective `page.tsx` files as `FAQItem[]` arrays passed to `buildFAQLD()` and `<FAQSection>` per SPEC.md §5.2
- [ ] T091 [P] Write 150–300 word SEO description prose for all 6 tool pages; add to respective `page.tsx` files inside `<ToolDescription>` per SPEC.md §5.1
- [ ] T092 Create `.lighthouserc.js` configuring Lighthouse CI to assert ≥ 95 on Performance, Accessibility, Best Practices, SEO for all 7 routes (`/`, `/checklist`, `/json-formatter`, `/cron-generator`, `/diff-checker`, `/jwt-decoder`, `/regex-tester`)
- [ ] T093 Run `npm run analyze` (bundle analyzer); verify every route's initial JS is ≤ 50 KB gzipped; fix any violations by moving imports to dynamic imports
- [ ] T094 Run `npm run build && npm run lighthouse` locally; fix any Lighthouse < 95 failures; common fixes: add `loading="lazy"` on images, verify ad container min-heights, check CLS in timeline
- [ ] T095 [P] Run full 12-item pre-merge checklist (CONSTITUTION.md §8) for all 6 tools; document results
- [ ] T096 Run `npm run type-check` — zero errors; run `npm run lint` — zero warnings; run `npm run test` — all unit tests pass; run `npm run e2e` — all smoke tests pass at both viewports
- [ ] T097 Deploy to Vercel: connect GitHub repo, set `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` and `NEXT_PUBLIC_GA_MEASUREMENT_ID` env vars in Vercel dashboard, trigger production deploy, verify all routes load on production URL
- [ ] T098 Submit sitemap to Google Search Console: add property, verify domain ownership, submit `https://{domain}/sitemap.xml`

**Checkpoint**: All CI gates green; Lighthouse ≥ 95 on all routes in production; AdSense slots rendering; sitemap submitted.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Requires Phase 1 complete — **BLOCKS all tool phases**
- **Phase 3 (Checklist)**: Requires Phase 2 complete — P1 flagship, implement first
- **Phase 4 (JSON Formatter)**: Requires Phase 2 complete — can parallel with Phase 5, 6
- **Phase 5 (JWT Decoder)**: Requires Phase 2 complete — can parallel with Phase 4, 6
- **Phase 6 (Cron Generator)**: Requires Phase 2 complete — can parallel with Phase 4, 5
- **Phase 7 (Regex Tester)**: Requires Phase 2 complete — can parallel with Phase 8
- **Phase 8 (Diff Checker)**: Requires Phase 2 complete — can parallel with Phase 7
- **Phase 9 (Polish)**: Requires all tool phases complete

### User Story Dependencies

- **US1 Checklist (P1)**: No dependency on other stories — implement first as MVP
- **US2 JSON Formatter (P2)**: Independent of all stories
- **US3 JWT Decoder (P2)**: Independent of all stories
- **US4 Cron Generator (P2)**: Independent of all stories
- **US5 Regex Tester (P3)**: Independent of all stories
- **US6 Diff Checker (P3)**: Independent of all stories; requires `SplitPane` component (T081)

### Within Each Phase

- `lib/tools/` pure function module → unit tests → `page.tsx` (metadata) + `loading.tsx` → tool component → E2E test
- [P] tasks within a phase have no inter-dependencies and can run in parallel

---

## Parallel Execution Examples

### Phase 2 — Foundation (run all in parallel once Phase 1 done)

```
T015 lib/utils.ts
T016 lib/ads-config.ts        ← independent
T017 lib/tools-registry.ts    ← independent
T018 lib/seo-helpers.ts       ← independent
T019 ThemeProvider.tsx         ← independent
T027 CopyButton.tsx            ← independent
T028 DownloadButton.tsx        ← independent
T029 ShareButton.tsx           ← independent
T030 PrivacyNotice.tsx         ← independent
T031 FAQSection.tsx            ← independent
T032 ToolDescription.tsx       ← independent
T033 ToolCard.tsx              ← independent
T040 about/privacy/terms pages ← independent
```

### Phase 3–8 — Tools (run all in parallel once Phase 2 done, if 3+ developers)

```
Developer A → Phase 3: Checklist (T041–T054)
Developer B → Phase 4: JSON Formatter (T055–T062) + Phase 5: JWT Decoder (T063–T068)
Developer C → Phase 6: Cron Generator (T069–T074) + Phase 7: Regex Tester (T075–T080) + Phase 8: Diff Checker (T081–T087)
```

### Within Each Tool Phase (lib + page/loading are parallelisable)

```
T055 json-formatter.ts    ← parallel
T056 json-formatter.test.ts ← parallel (write with T055)
T057 loading.tsx          ← parallel
```

---

## Implementation Strategy

### MVP First (Checklist Only — Ship in ~3 days)

1. Complete Phase 1: Setup (~1 day)
2. Complete Phase 2: Foundation (~1 day)
3. Complete Phase 3: Smart Checklist (~1 day)
4. **STOP AND VALIDATE**: Run E2E, check Lighthouse, test on mobile
5. Deploy — this is a shippable product (1 tool + homepage)

### Incremental Delivery

| Sprint | Deliverable | New routes live |
|---|---|---|
| 1 | Setup + Foundation + Checklist | `/checklist` |
| 2 | JSON Formatter + JWT Decoder | `/json-formatter`, `/jwt-decoder` |
| 3 | Cron Generator + Regex Tester | `/cron-generator`, `/regex-tester` |
| 4 | Diff Checker + Polish | `/diff-checker`, all SEO complete |

### Single Developer

Follow phases sequentially: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Each phase is shippable.

---

## Notes

- `[P]` tasks touch different files — safe to run in parallel within a phase
- All `lib/tools/*.ts` functions are pure TypeScript — no React, no DOM, no side effects
- Never import heavy libraries at module level; always use dynamic `import()` inside handlers or effects
- Every tool page is a Server Component shell; only `_components/*.tsx` files use `'use client'`
- The `diff` package import in `diffLines()` must be dynamic (inside the function body) — it must never appear in the `/diff-checker` initial bundle
- `lz-string` is the only heavy-ish dependency allowed in the initial `/checklist` bundle (needed for URL decode on page load)
- Commit after each checkpoint; never commit a red `npm run type-check`
