# Feature Specification: DevTools Suite Platform

**Feature ID**: 001-devtools-suite-platform
**Created**: 2026-05-23
**Status**: Draft
**Priority**: High

---

## Overview

### Feature Name
DevTools Suite — Modern Developer Productivity Platform

### Problem Statement
Developers, release managers, QA engineers, and technical PMs rely on fragmented, slow, ad-cluttered, or login-gated utility sites to perform everyday workflow tasks such as formatting JSON, validating cron expressions, decoding JWTs, running regex tests, diffing text, and tracking task checklists. These tools are either:

- Too slow to be practical mid-workflow
- Require accounts or data submission to a server (privacy risk)
- Visually outdated, distracting, and not optimized for keyboard users
- Not optimised for mobile use or dark environments

There is no single, cohesive, high-quality, privacy-first toolkit purpose-built for the modern developer workflow.

### Proposed Solution
A suite of 6 high-quality, client-side-only developer tools delivered as a single fast web platform: DevTools Suite. Every tool runs entirely in the user's browser with zero server communication, zero login, and sub-second interaction. The platform is designed to be bookmarked, shared, and returned to daily.

### Goals
1. Deliver 6 tools that cover the most-repeated developer workflow tasks
2. Achieve a user experience meaningfully superior to every existing competitor
3. Rank on Google for high-volume developer tool keywords (SEO-first architecture)
4. Generate revenue through non-intrusive Google AdSense placements
5. Build a platform users bookmark and return to repeatedly

### Non-Goals
- Real-time collaboration or team features (future roadmap)
- User accounts, authentication, or personalized cloud storage
- Server-side processing of any kind
- Native mobile applications
- AI-generated content or AI-assisted features in v1

---

## User Personas

### Persona 1 — Backend Developer (Primary)
**Profile**: Writes APIs, works with JSON/JWTs/cron jobs daily. Uses dark mode. Reaches for browser tools mid-IDE workflow. Hates typing URLs or logging in.
**Pain points**: Existing JSON formatters are slow, JWT decoders require paste into sketchy third-party sites, cron builders are ugly or broken.
**Jobs to be done**: Format a JSON response, decode a JWT without sending it to a server, build and verify a cron expression quickly.

### Persona 2 — Release Manager / QA Engineer (Flagship)
**Profile**: Coordinates deployments, writes release checklists from Jira exports, confluence docs, or emails. Needs to track checklist state across sessions.
**Pain points**: Copy-pasting from spreadsheets is error-prone; no good browser-based checklist tool preserves state and supports bulk paste.
**Jobs to be done**: Paste a release runbook and get an interactive, stateful checklist they can share with the team via URL.

### Persona 3 — Technical PM
**Profile**: Non-coder but technically literate. Uses regex tools to validate data patterns, diff tools to compare requirement docs.
**Pain points**: Tools that require technical setup or that expose too much implementation detail.
**Jobs to be done**: Compare two versions of a spec document, test a data validation regex.

### Persona 4 — DevOps / Platform Engineer
**Profile**: Writes cron jobs, scheduled tasks, Kubernetes CronJobs. Needs to verify expression correctness and preview execution times before deploying.
**Jobs to be done**: Visually build a cron expression, verify its human meaning, and see next 5 execution times.

---

## User Scenarios & Testing

### Scenario 1 — Release checklist from Jira export (Flagship)
**Actor**: Release Manager
**Precondition**: Has a list of Jira task titles copied from a sprint board
**Steps**:
1. Navigate to `/checklist`
2. Paste multi-line text (or CSV from Jira export) into the input area
3. Click "Create Checklist" or press `Ctrl+Enter`
4. Work through checklist: mark items checked, invalid, or unchecked
5. Progress bar updates in real time
6. Close browser tab; reopen — checklist state is restored from local storage
7. Click "Share" — receive a URL encoding the full checklist state
8. Colleague opens URL — sees same checklist, can continue working
**Expected outcome**: Checklist created in < 1 second, all state persists, share URL works

### Scenario 2 — Format and validate a large API response
**Actor**: Backend Developer
**Steps**:
1. Copy a JSON string from API response (possibly malformed)
2. Navigate to `/json-formatter`
3. Paste into editor
4. Click "Format" or press `Ctrl+Enter`
5. If valid: prettified output with syntax highlighting appears
6. If invalid: error message with exact line/column number
7. Toggle to tree view to explore nested structure
8. Click "Copy" to return formatted JSON to clipboard
**Expected outcome**: Format completes instantly; error locations are precise; copy works

### Scenario 3 — Decode a JWT from a staging environment
**Actor**: Backend Developer
**Steps**:
1. Copy JWT from browser dev tools / Postman
2. Navigate to `/jwt-decoder`
3. Paste token — header, payload, signature panels appear immediately
4. Expiry panel shows "Expires in 23 minutes" or "EXPIRED 2 days ago" in red
5. All standard claims are labeled and explained
6. Developer copies formatted payload to clipboard
**Expected outcome**: Decode is instant; privacy notice is visible; no network requests made

### Scenario 4 — Build a production cron schedule
**Actor**: DevOps Engineer
**Steps**:
1. Navigate to `/cron-generator`
2. Select "Weekdays at 9am" preset
3. Visual fields update to `0 9 * * 1-5`
4. Human-readable output: "At 09:00 AM, Monday through Friday"
5. Next 5 execution times listed with exact UTC timestamps
6. Copy AWS EventBridge format: `cron(0 9 ? * MON-FRI *)`
**Expected outcome**: No invalid expression possible via visual builder; formats are correct

### Scenario 5 — Compare two versions of a config file
**Actor**: Technical PM / Developer
**Steps**:
1. Navigate to `/diff-checker`
2. Paste old config in left pane, new config in right pane
3. Differences highlighted line-by-line in real time
4. JSON detected — switch to JSON diff mode for structural comparison
5. Download diff as `.diff` file
**Expected outcome**: Diff renders in < 500ms; scrolling is synchronized between panes

### Scenario 6 — Test a regex for email validation
**Actor**: Developer
**Steps**:
1. Navigate to `/regex-tester`
2. Type or paste regex pattern
3. Add test strings — valid and invalid emails
4. Matches highlighted live in test strings
5. Click "Explain" — plain-English breakdown of each token appears
6. Toggle flags (`i`, `g`, `m`) and see match results update instantly
**Expected outcome**: Live highlighting < 100ms latency; explanation is accurate

---

## Functional Requirements

### FR-001: Platform Shell
- **FR-001.1**: The platform renders correctly at all viewport widths from 320px to 2560px
- **FR-001.2**: Dark mode and light mode are supported on every page; user preference persists via localStorage; system preference is detected on first visit
- **FR-001.3**: Dark/light mode toggle switches without page reload and without visual flash
- **FR-001.4**: A consistent navigation bar appears on all pages with: logo, link to homepage, search/filter for tools, and theme toggle
- **FR-001.5**: A footer appears on all pages with tool links, platform name, and copyright
- **FR-001.6**: Google AdSense loads only after the page is fully interactive; ads never delay tool functionality
- **FR-001.7**: Three ad placements exist per tool page: header banner, sidebar (desktop only), in-content below tool output
- **FR-001.8**: Ad containers have explicit reserved dimensions to prevent cumulative layout shift

### FR-002: Homepage
- **FR-002.1**: All 6 tools are displayed as browseable cards with name, description, and direct link
- **FR-002.2**: Tools are grouped into meaningful categories (e.g., Productivity, Data & Format, Developer Utilities)
- **FR-002.3**: A search/filter input narrows displayed tools in real time by name or keyword
- **FR-002.4**: The homepage loads with a Lighthouse Performance score of 95 or above
- **FR-002.5**: Homepage has a unique SEO title, meta description, and Open Graph image

### FR-003: Smart Checklist Tool
- **FR-003.1**: Users can paste any of the following input formats and receive a parsed checklist: newline-separated, comma-separated, tab-separated, or any mixture thereof
- **FR-003.2**: Empty lines and excess whitespace are stripped automatically during parsing
- **FR-003.3**: Input text containing existing markers (`[ ]`, `[x]`, `[X]`, `[?]`, `- [ ]`, `- [x]`) is parsed with pre-populated item state
- **FR-003.4**: Numbered list prefixes (`1.`, `2.`) and bullet prefixes (`-`, `*`, `•`) are stripped but item order is preserved
- **FR-003.5**: Each checklist item has three states: unchecked, checked, invalid; states cycle on Space key press; invalid state is set with X key
- **FR-003.6**: A progress bar displays `{checked}/{total}` and fills proportionally; it turns visually distinct (green) at 100% completion
- **FR-003.7**: Users can reorder items via drag-and-drop on both desktop and touch devices
- **FR-003.8**: A live search/filter input hides non-matching items; pressing Escape clears the filter
- **FR-003.9**: Checklist state is automatically saved to localStorage on every change and restored on page load
- **FR-003.10**: Users can export the checklist as: plain text (one item per line), Markdown checkboxes, CSV, or PDF
- **FR-003.11**: A "Share" button generates a URL encoding the full checklist state; opening that URL on any device restores the checklist exactly
- **FR-003.12**: A "Print" action opens a print-friendly view with no navigation chrome, no ads, and clean typography
- **FR-003.13**: Lists containing more than 200 items render without visible jank or frame drops; virtualization is applied automatically
- **FR-003.14**: Bulk operations are available: check all, uncheck all, delete all checked, delete all invalid
- **FR-003.15**: Keyboard navigation: arrow keys move focus between items; Space/X toggle state; Tab moves to action buttons

### FR-004: JSON Formatter & Validator
- **FR-004.1**: Pasting or typing JSON triggers real-time validation; errors display with line number, column number, and human-readable message
- **FR-004.2**: "Prettify" formats JSON with configurable indentation (2 or 4 spaces)
- **FR-004.3**: "Minify" collapses JSON to a single line with all whitespace removed
- **FR-004.4**: Syntax highlighting distinguishes: strings, numbers, booleans, null, keys, and brackets using colour
- **FR-004.5**: A collapsible tree view allows exploring nested JSON structure
- **FR-004.6**: Users can upload a `.json` file via file picker or drag-and-drop to populate the editor
- **FR-004.7**: A "Copy" button copies the current output to clipboard with confirmation feedback
- **FR-004.8**: A "Download" button saves the formatted JSON as a `.json` file
- **FR-004.9**: JSON payloads larger than 1 MB display a performance warning; tree view is disabled for payloads over 5 MB
- **FR-004.10**: An optional "Sort keys" toggle alphabetically sorts all object keys recursively

### FR-005: Cron Expression Generator
- **FR-005.1**: A visual builder presents five independently-editable fields: Minute, Hour, Day of Month, Month, Day of Week
- **FR-005.2**: Each field accepts: specific values, ranges (`1-5`), step values (`*/15`), lists (`1,3,5`), and wildcards (`*`)
- **FR-005.3**: Clicking field values in the visual picker updates the expression text instantly
- **FR-005.4**: The human-readable interpretation updates live as the expression changes (e.g., "At 09:00 AM, Monday through Friday")
- **FR-005.5**: The next 5 execution times are calculated and displayed with UTC timestamps and relative time (e.g., "in 3 hours")
- **FR-005.6**: Output is provided in all of: Unix/Linux cron, AWS EventBridge cron, Spring `@Scheduled`, and Quartz formats
- **FR-005.7**: A presets library offers at least 10 named common schedules (e.g., "Every minute", "Daily at midnight", "Weekdays at 9am", "First of month")
- **FR-005.8**: Pasting an existing cron expression into the raw input field populates the visual builder fields
- **FR-005.9**: Invalid cron expressions display a descriptive error; no invalid state is committable via the visual builder

### FR-006: Diff Checker
- **FR-006.1**: Two input panes accept text simultaneously; differences are computed and displayed in real time (debounced at 200ms)
- **FR-006.2**: A side-by-side view shows added lines in green, removed lines in red, and unchanged lines in neutral colour, with line numbers
- **FR-006.3**: A unified view is available as an alternative display mode
- **FR-006.4**: Character-level (intra-line) diff highlighting shows exact changed characters within modified lines
- **FR-006.5**: When both panes contain valid JSON, a "JSON diff" mode is available that performs structural comparison (ignoring key order)
- **FR-006.6**: Either pane accepts file upload via drag-and-drop or file picker
- **FR-006.7**: A diff summary shows: N lines added, M lines removed, K lines changed
- **FR-006.8**: Toggles exist for: ignore whitespace, ignore case
- **FR-006.9**: Users can copy the diff output or download it as a `.diff` file
- **FR-006.10**: Side-by-side panes scroll synchronously

### FR-007: JWT Decoder
- **FR-007.1**: Pasting a JWT token instantly renders three labelled sections: Header, Payload, Signature
- **FR-007.2**: Header and Payload sections display as formatted, syntax-highlighted JSON
- **FR-007.3**: Standard JWT claims are annotated inline: `exp` (expiry date + relative time), `iat` (issued-at date), `nbf` (not-before date), `sub`, `iss`, `aud`
- **FR-007.4**: An expiry status badge displays: "VALID" (green), "EXPIRED" (red), or "NOT YET VALID" (amber) based on the `exp` claim
- **FR-007.5**: The Signature section displays a non-verification notice: "Signature is NOT cryptographically verified — this tool only decodes; it does not validate"
- **FR-007.6**: The raw token view colour-codes the three dot-separated segments differently
- **FR-007.7**: Copy buttons are available for: full formatted output, header JSON, payload JSON
- **FR-007.8**: A visible privacy notice states the token is processed entirely in the browser with no network transmission
- **FR-007.9**: Malformed or non-JWT input displays a clear error message

### FR-008: Regex Tester
- **FR-008.1**: A pattern input field accepts the regex; match highlighting updates live in the test string area (debounced at 100ms)
- **FR-008.2**: Flag toggles are provided for: global (`g`), case-insensitive (`i`), multiline (`m`), dotAll (`s`), unicode (`u`), sticky (`y`)
- **FR-008.3**: All matches are listed below the test area with: match index, matched value, and named/numbered capture group values
- **FR-008.4**: A "Replace" mode accepts a replacement string and shows a live preview of the replaced output
- **FR-008.5**: Multiple test strings can be added; each shows a pass/fail indicator (matched / no match)
- **FR-008.6**: Invalid regex patterns display a descriptive error message with the invalid token indicated
- **FR-008.7**: An "Explain" toggle expands a plain-English breakdown of each regex token (e.g., `\d{2,4}` → "2 to 4 digits")
- **FR-008.8**: The pattern input applies syntax colouring to distinguish: groups, quantifiers, anchors, character classes, and escape sequences

### FR-009: SEO Requirements (all tool pages)
- **FR-009.1**: Every page exports a unique `generateMetadata()` with: title, description, keywords, canonical URL, Open Graph tags, Twitter Card tags
- **FR-009.2**: No two pages share the same title or meta description
- **FR-009.3**: Every tool page includes a `SoftwareApplication` JSON-LD structured data block
- **FR-009.4**: Every tool page includes a `FAQPage` JSON-LD block with a minimum of 5 questions
- **FR-009.5**: Every tool page includes a 150–300 word plain-language description of the tool below the workspace
- **FR-009.6**: Every tool page includes an FAQ accordion section (minimum 5 entries) below the description
- **FR-009.7**: An auto-generated sitemap covers all routes
- **FR-009.8**: A `robots.txt` permits all crawlers on all routes

### FR-010: Performance Requirements
- **FR-010.1**: Every page achieves Lighthouse scores of 95 or above in all four categories: Performance, Accessibility, Best Practices, SEO
- **FR-010.2**: Every tool loads and is fully interactive within 1 second on a mid-range device with a standard broadband connection
- **FR-010.3**: All tool execution (parsing, formatting, matching, decoding) completes within 200ms for typical inputs
- **FR-010.4**: Per-route JavaScript payload does not exceed 50KB gzipped (excluding shared vendor chunks)
- **FR-010.5**: All images use next-generation formats and have explicit width, height, and alt attributes
- **FR-010.6**: Fonts are loaded via the platform's font system with display-swap; no render-blocking font stylesheets

---

## Success Criteria

### SC-001: Tool Performance
- Every tool page is fully interactive in under 1 second on a throttled connection (measured by automated Lighthouse audit)
- Lighthouse Performance score is 95 or above on every route
- Tool execution (the core compute task) completes in under 200ms for any typical developer input

### SC-002: User Experience Quality
- A user can complete their primary task (format JSON, decode a JWT, etc.) in under 30 seconds from first visit with no prior knowledge of the platform
- Every tool is fully operable by keyboard alone — no mouse required for any core workflow
- Every tool is fully usable on a 375px-wide mobile screen without horizontal scrolling

### SC-003: SEO Visibility
- Every page achieves a Lighthouse SEO score of 95 or above
- All tool pages have unique, keyword-optimised titles and descriptions
- Structured data validates without errors in Google's Rich Results Test

### SC-004: Privacy & Trust
- Zero network requests are made from any tool's core logic (validated by browser network inspector showing no outbound XHR/fetch from tool components)
- No user data is stored outside the user's own browser (localStorage only)
- JWT Decoder, JSON Formatter, and all other tools display a visible privacy notice confirming local-only processing

### SC-005: Monetisation Readiness
- AdSense slots render on every tool page without blocking tool interactivity
- Cumulative Layout Shift (CLS) on all pages is below 0.05 (Lighthouse audit)
- Ad containers have correct reserved dimensions so no layout shift occurs when ads load

### SC-006: Checklist Persistence & Sharing
- A checklist created and modified by a user is restored exactly after closing and reopening the browser tab
- A shared checklist URL, when opened on a different device, renders the identical checklist state

---

## Assumptions

- **A-001**: The platform will be deployed on Vercel with a static-first build; no server-side runtime is required at launch
- **A-002**: AdSense publisher ID and slot IDs will be provided by the owner before production deployment; placeholder constants are used during development
- **A-003**: OG images (1200×630) are pre-generated at build time, one per tool; dynamic OG generation is not required for v1
- **A-004**: The cron "next 5 executions" feature runs in the user's local timezone unless the user is explicitly on a UTC-labelled output; no timezone selector is required for v1
- **A-005**: PDF export for the checklist uses a lightweight client-side library; exact visual fidelity to the screen rendering is not required — clean legibility is sufficient
- **A-006**: The Regex Explainer in v1 uses a built-in rule-based tokeniser, not an AI model
- **A-007**: File upload limits are 10MB per file for diff and JSON formatter inputs
- **A-008**: The shared checklist URL encoding uses LZ-string compression; URLs may be long for large lists but must remain copyable and shareable via standard messaging tools

---

## Constraints

- **C-001**: No API routes, server actions, database, or authentication may be introduced — the platform is 100% static and client-side
- **C-002**: Only Tailwind CSS and shadcn/ui may be used for styling — no other CSS frameworks or component libraries
- **C-003**: TypeScript strict mode must be maintained with zero `any` types
- **C-004**: All heavy libraries (PDF generation, drag-and-drop, virtualisation, diff engine) must be dynamically imported and must not appear in the initial route bundle
- **C-005**: Every tool must pass the 12-item pre-merge checklist defined in CONSTITUTION.md

---

## Dependencies

- **D-001**: Next.js 14 App Router and ecosystem (next/image, next/font, next/script, next/dynamic)
- **D-002**: shadcn/ui component primitives
- **D-003**: Tailwind CSS and tailwindcss-animate
- **D-004**: `lz-string` — URL-safe compression for checklist share URLs
- **D-005**: `diff` npm package — text/line diffing engine
- **D-006**: `jspdf` — PDF export (dynamically imported)
- **D-007**: `@dnd-kit/core` + `@dnd-kit/sortable` — drag-and-drop reorder (dynamically imported)
- **D-008**: `@tanstack/react-virtual` — checklist virtualisation for large lists (dynamically imported)
- **D-009**: Google AdSense script (loaded via next/script strategy="afterInteractive")
- **D-010**: Vercel deployment platform

---

## Out of Scope (v1)

- Team collaboration, real-time multi-user editing
- User accounts, saved workspaces in the cloud
- AI-assisted features (regex explanation via LLM, JSON schema inference)
- Embeddable widget versions of tools
- Browser extension
- Native mobile apps
- More than 6 tools at launch
- Internationalisation / multi-language support
- Analytics beyond what AdSense provides natively
