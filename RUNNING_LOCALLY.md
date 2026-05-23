# Running DevTools Suite Locally

A complete guide to setting up, running, and testing the project on your machine.

---

## Prerequisites

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | 18.17+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | Any | `git --version` |

---

## Quick Start

```powershell
# 1. Navigate to the project folder
cd "d:\SaaS\DevTools Suite\devtools-suite"

# 2. Install dependencies (skip if node_modules already exists)
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Environment Variables (Optional)

The app works fully without any environment variables. Copy the example file only if you want to enable AdSense ads or Google Analytics:

```powershell
Copy-Item .env.example .env.local
```

Then edit `.env.local`:

```env
# Google AdSense — leave blank to disable ads
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXXX

# Google Analytics 4 — leave blank to disable tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console verification token
NEXT_PUBLIC_GSC_VERIFICATION=XXXXXXXXXX

# Canonical URL used in SEO meta tags and sitemap
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** `.env.local` is git-ignored. Never commit real keys.

---

## All Routes

| URL | Page |
|-----|------|
| http://localhost:3000 | Homepage — tool grid |
| http://localhost:3000/checklist | Smart Checklist |
| http://localhost:3000/json-formatter | JSON Formatter |
| http://localhost:3000/cron-generator | Cron Generator |
| http://localhost:3000/diff-checker | Diff Checker |
| http://localhost:3000/jwt-decoder | JWT Decoder |
| http://localhost:3000/regex-tester | Regex Tester |
| http://localhost:3000/about | About |
| http://localhost:3000/privacy | Privacy Policy |
| http://localhost:3000/terms | Terms of Service |
| http://localhost:3000/sitemap.xml | XML Sitemap |
| http://localhost:3000/robots.txt | Robots |

---

## Available Commands

### Development

```powershell
# Start dev server with hot reload
npm run dev

# Type-check the entire project (zero errors expected)
npm run type-check

# Lint all TypeScript/TSX files
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without writing changes
npm run format:check
```

### Testing

```powershell
# Run all 38 unit tests once
npm test

# Run tests in watch mode (re-runs on file save)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run E2E tests with Playwright (requires dev server running)
npm run test:e2e

# Open Playwright UI mode
npm run test:e2e:ui

# Run type-check + lint + unit tests in one command
npm run validate
```

### Production Build

```powershell
# Build for production
npm run build

# Serve the production build locally on :3000
npm run start
```

---

## Testing Each Tool Manually

### Smart Checklist — `/checklist`

1. Paste any list of items (newline, comma, or tab separated) into the textarea
2. Click **Create Checklist**
3. Click a checkbox to cycle states: **unchecked → checked (green) → invalid (red X)**
4. Use the **filter box** (appears when list has > 5 items) to search by keyword
5. Click **Check All** to mark everything done
6. Click **Share** → a URL is copied to clipboard; open it in a new tab to verify the list restores
7. Click **Export → PDF** to download a print-ready checklist
8. **Refresh the page** → the list auto-restores from `localStorage`

**Test with this sample input:**
```
Deploy database migrations
Run smoke tests
Update release notes
Notify stakeholders
Archive old builds
```

---

### JSON Formatter — `/json-formatter`

1. Paste JSON into the left textarea
2. Click **Prettify** → formatted output appears with syntax highlighting
3. Click **Minify** → single-line compact output
4. Click **Sort Keys** → keys sorted alphabetically
5. Change the **Indent** dropdown (2 spaces / 4 spaces / 1 space)
6. Click **Copy** or **Save** to export the output
7. Toggle between **Highlighted** and **Raw** tabs

**Test with valid JSON:**
```json
{"name":"DevTools","version":"1.0","tools":["checklist","json","cron"]}
```

**Test error detection — paste this invalid JSON:**
```
{name: "missing quotes", version: 1,}
```
→ Error message should show with line and column number.

---

### Cron Generator — `/cron-generator`

1. Click a **preset chip** (e.g. *Weekdays 9am*) — fields auto-fill
2. Edit any field manually (e.g. change **Minute** to `*/15`)
3. Human-readable description updates live (e.g. *"Every 15 minutes, Monday through Friday"*)
4. View the **Next 5 executions** list in UTC
5. Copy the **AWS EventBridge** format → verify it starts with `cron(`
6. Copy the **Spring @Scheduled** format → verify it has a `0` seconds prefix
7. Type `0 9 * * 1-5` directly into the **raw expression** input and click **Parse**

**Common presets to test:**

| Preset | Expression | Expected meaning |
|--------|-----------|-----------------|
| Every minute | `* * * * *` | Every minute |
| Every 5 min | `*/5 * * * *` | Every 5 minutes |
| Daily midnight | `0 0 * * *` | At 12:00 AM daily |
| Weekdays 9am | `0 9 * * 1-5` | At 9:00 AM Mon–Fri |
| Monthly 1st | `0 0 1 * *` | At midnight on 1st of each month |

---

### Diff Checker — `/diff-checker`

1. Paste text in the **Original** (left) pane
2. Paste modified text in the **Modified** (right) pane
3. Click **Compare**
4. Green rows = lines added, red rows = lines removed
5. Check the **summary bar** (N added / N removed / N unchanged)
6. Switch between **Line Diff**, **Character Diff**, and **JSON Diff** modes
7. Click **Download Patch** → saves a `.patch` file
8. Use the **Upload file** button on either pane to load a `.txt` or `.json` file

**Test with this pair:**

Original:
```
Hello world
This line stays
Old content here
```

Modified:
```
Hello earth
This line stays
New content here
```

---

### JWT Decoder — `/jwt-decoder`

1. Paste a JWT token and click **Decode Token**
2. See three panels: **Header**, **Payload**, **Signature**
3. Check the **expiry status badge** (Valid / Expired / No Expiry / Not Yet Valid)
4. Timestamps (`exp`, `iat`, `nbf`) show both Unix epoch and human-readable relative time
5. Click **Copy JSON** on Header or Payload to copy formatted output
6. Paste an invalid string → see the error message

**Test token (no expiry — always valid):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Expected decoded payload:
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

> **Privacy note:** This decoder runs 100% client-side using `atob()`. Your token is never sent anywhere.

---

### Regex Tester — `/regex-tester`

1. Type a pattern in the **pattern input** (e.g. `\d+`)
2. Type test text below (e.g. `abc 123 def 456`)
3. Matching portions highlight in **yellow** in real time
4. Check the **match list** below for index, position, and captured groups
5. Toggle **flags** (`g`, `i`, `m`, `s`, `u`) using the buttons
6. Click the **Replace** tab → enter a replacement string (e.g. `NUM`) → see live preview
7. Click the **Explain** tab → see what each token in your pattern does

**Quick test cases:**

| Pattern | Flags | Input | Expected |
|---------|-------|-------|---------|
| `\d+` | `g` | `abc 123 def 456` | 2 matches: 123, 456 |
| `[A-Z]+` | `gi` | `Hello World` | 2 matches: Hello, World |
| `^(\w+)` | `gm` | `foo\nbar\nbaz` | 3 matches: foo, bar, baz |
| `(\w+)@(\w+)` | `g` | `a@b c@d` | 2 matches with 2 groups each |

---

## Dark / Light Mode

Click the **sun/moon icon** in the top-right of the navigation bar.

Your preference is saved in `localStorage` under the key `devtools_theme` and persists across page loads. The theme is applied before first paint (no flash of unstyled content).

---

## Project Structure

```
devtools-suite/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout: Nav, Footer, ThemeProvider, GA4
│   ├── page.tsx                  # Homepage with tool grid
│   ├── globals.css               # Tailwind base + CSS variables (light/dark)
│   ├── sitemap.ts                # Auto-generated sitemap.xml
│   ├── robots.ts                 # robots.txt
│   ├── checklist/page.tsx        # Smart Checklist page
│   ├── json-formatter/page.tsx   # JSON Formatter page
│   ├── cron-generator/page.tsx   # Cron Generator page
│   ├── diff-checker/page.tsx     # Diff Checker page
│   ├── jwt-decoder/page.tsx      # JWT Decoder page
│   ├── regex-tester/page.tsx     # Regex Tester page
│   ├── about/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── nav.tsx               # Sticky navigation bar
│   │   ├── footer.tsx            # Site footer
│   │   └── theme-provider.tsx    # next-themes wrapper
│   ├── tools/
│   │   ├── tool-layout.tsx       # ToolLayout, ToolHeader, ToolSection
│   │   ├── faq-section.tsx       # FAQ accordion
│   │   ├── tool-description.tsx  # SEO prose wrapper
│   │   ├── checklist-tool.tsx    # Smart Checklist UI
│   │   ├── json-formatter-tool.tsx
│   │   ├── cron-generator-tool.tsx
│   │   ├── diff-checker-tool.tsx
│   │   ├── jwt-decoder-tool.tsx
│   │   └── regex-tester-tool.tsx
│   └── ui/
│       ├── button.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── badge.tsx
│       ├── copy-button.tsx
│       └── ad-slot.tsx           # Google AdSense container
│
├── lib/
│   ├── tools/                    # Pure functions — no React, fully testable
│   │   ├── checklist.ts
│   │   ├── json-formatter.ts
│   │   ├── cron-generator.ts
│   │   ├── diff-checker.ts
│   │   ├── jwt-decoder.ts
│   │   ├── regex-tester.ts
│   │   └── __tests__/            # 38 unit tests
│   ├── seo/
│   │   └── metadata.ts           # toolMetadata(), webApplicationLD(), faqPageLD()
│   └── utils.ts                  # cn(), copyToClipboard(), downloadFile(), etc.
│
├── specs/                        # Planning artifacts (read-only reference)
│   └── 001-devtools-suite-platform/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── data-model.md
│       ├── research.md
│       └── contracts/
│
├── e2e/                          # Playwright E2E tests (to be added)
├── .env.example                  # Environment variable template
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── playwright.config.ts
```

---

## Troubleshooting

**Port 3000 already in use**
```powershell
# Run on a different port
npx next dev -p 3001
```

**`node_modules` missing or corrupted**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**TypeScript errors after pulling changes**
```powershell
npm run type-check
```

**Styles not updating**
```powershell
# Restart the dev server — Tailwind sometimes needs a fresh start
# Press Ctrl+C, then:
npm run dev
```

**Tests failing**
```powershell
# Run with verbose output
npx vitest run --reporter=verbose
```

---

## Key Architecture Notes

- **Zero backend** — every tool runs entirely in your browser. No API routes, no server calls from tool logic.
- **Dark mode** — uses `darkMode: 'class'` in Tailwind. A blocking inline `<script>` in `<head>` sets the `dark` class before first paint to prevent flash.
- **Dynamic imports** — heavy libraries (`@dnd-kit`, `jspdf`, `diff`, `cronstrue`, `cron-parser`) are imported inside handler functions, not at module load time, keeping initial bundles small.
- **localStorage** — the checklist auto-saves under the key `devtools_checklist_v1`. Theme preference saves under `devtools_theme`.
- **AdSense** — ad slots only render when `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set. Without it, the `<AdSlot>` component returns `null`.
