# Data Model: DevTools Suite Platform

**Phase**: 1 — Design
**Date**: 2026-05-23
**Feature**: 001-devtools-suite-platform

> All data is ephemeral (in-memory React state) or persisted only in the browser (localStorage, URL params). No server-side entities exist.

---

## 1. Smart Checklist — Core Entities

### ChecklistItem

```typescript
type ChecklistState = 0 | 1 | 2;
// 0 = unchecked, 1 = checked, 2 = invalid

interface ChecklistItem {
  id: string;           // nanoid() — stable across reorders
  text: string;         // trimmed, non-empty
  state: ChecklistState;
}
```

### ChecklistWorkspace

```typescript
interface ChecklistWorkspace {
  items: ChecklistItem[];
  createdAt: number;    // Unix timestamp ms
  updatedAt: number;    // Unix timestamp ms
  version: 1;           // schema version for localStorage migration
}
```

### ChecklistURLPayload (URL share encoding)

```typescript
// Serialised form before lz-string compression
interface ChecklistURLPayload {
  v: 1;
  items: Array<[string, ChecklistState]>; // [text, state]
}
```

### State Transitions

```
unchecked (0) ──Space──► checked (1) ──Space──► unchecked (0)
unchecked (0) ──X key──► invalid (2)
checked (1)   ──X key──► invalid (2)
invalid (2)   ──Space──► unchecked (0)
invalid (2)   ──X key──► unchecked (0)
```

### localStorage Schema

```
Key: "devtools_checklist_v1"
Value: JSON.stringify(ChecklistWorkspace)
```

### Validation Rules

- `item.text`: trimmed length > 0; max 500 characters
- `items` array: max 10,000 items (warn at > 5,000)
- URL payload: compressed string must fit in 8,000 characters (safe for all platforms)

---

## 2. JSON Formatter — State Model

```typescript
interface JSONFormatterState {
  input: string;                          // raw textarea content
  output: string | null;                  // formatted result, null if error
  error: JSONFormatterError | null;
  indentSize: 2 | 4;
  sortKeys: boolean;
  viewMode: 'text' | 'tree';
}

interface JSONFormatterError {
  message: string;                        // human-readable description
  line: number | null;                    // 1-indexed; null if not determinable
  column: number | null;
  offset: number | null;                  // character offset in input string
}
```

> No persistence. State resets on page reload. No localStorage for JSON content (privacy — JSON may contain sensitive data).

---

## 3. Cron Generator — State Model

```typescript
interface CronField {
  value: string;        // raw field string: "*", "0-5", "*/15", "1,3,5", etc.
  isValid: boolean;
}

interface CronState {
  fields: {
    minute: CronField;
    hour: CronField;
    dayOfMonth: CronField;
    month: CronField;
    dayOfWeek: CronField;
  };
  expression: string;                    // derived: joins fields with space
  isValid: boolean;
  humanReadable: string | null;          // cronstrue output; null if invalid
  nextExecutions: Date[];                // next 5 execution times; empty if invalid
  outputFormat: 'unix' | 'eventbridge' | 'spring' | 'quartz';
}
```

### Output Format Transformations

| Format | Transformation |
|---|---|
| `unix` | `"m h dom mon dow"` — raw 5-field |
| `eventbridge` | `"cron(m h dom mon dow year)"` — `?` replaces `*` for dom/dow conflict, `*` appended as year |
| `spring` | `@Scheduled(cron = "0 m h dom mon dow")` — seconds field prepended as `0` |
| `quartz` | `"0 m h dom mon dow"` — seconds field prepended as `0` |

### Presets

```typescript
const CRON_PRESETS: Array<{ label: string; expression: string; description: string }> = [
  { label: "Every minute",        expression: "* * * * *",     description: "Runs every minute" },
  { label: "Every 5 minutes",     expression: "*/5 * * * *",   description: "Runs every 5 minutes" },
  { label: "Every 15 minutes",    expression: "*/15 * * * *",  description: "Runs every 15 minutes" },
  { label: "Every hour",          expression: "0 * * * *",     description: "At the start of every hour" },
  { label: "Daily at midnight",   expression: "0 0 * * *",     description: "Every day at 00:00 UTC" },
  { label: "Daily at 9am",        expression: "0 9 * * *",     description: "Every day at 09:00" },
  { label: "Weekdays at 9am",     expression: "0 9 * * 1-5",  description: "Monday–Friday at 09:00" },
  { label: "Weekly (Monday)",     expression: "0 0 * * 1",    description: "Every Monday at midnight" },
  { label: "First of month",      expression: "0 0 1 * *",    description: "1st of every month at midnight" },
  { label: "Quarterly",           expression: "0 0 1 */3 *",  description: "1st of every 3rd month" },
];
```

---

## 4. Diff Checker — State Model

```typescript
type DiffMode = 'line' | 'char' | 'json';
type DiffView = 'side-by-side' | 'unified';

interface DiffChange {
  type: 'added' | 'removed' | 'equal';
  value: string;
  lineNumber?: { left: number | null; right: number | null };
}

interface DiffState {
  leftText: string;
  rightText: string;
  mode: DiffMode;
  view: DiffView;
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  changes: DiffChange[];
  summary: {
    added: number;
    removed: number;
    changed: number;
  };
  jsonModeAvailable: boolean;  // true when both sides parse as valid JSON
}
```

> No persistence. No localStorage (content may be sensitive).

---

## 5. JWT Decoder — State Model

```typescript
type JWTExpiryStatus = 'valid' | 'expired' | 'not_yet_valid' | 'no_expiry';

interface JWTClaims {
  // Standard claims (typed)
  exp?: number;
  iat?: number;
  nbf?: number;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  jti?: string;
  // Extended claims
  [key: string]: unknown;
}

interface JWTDecoded {
  raw: string;
  header: Record<string, unknown>;
  payload: JWTClaims;
  signature: string;
  expiryStatus: JWTExpiryStatus;
  expiresAt: Date | null;
  issuedAt: Date | null;
  notBefore: Date | null;
}

interface JWTState {
  input: string;
  decoded: JWTDecoded | null;
  error: string | null;
}
```

> No persistence. JWT input is never written to localStorage.

---

## 6. Regex Tester — State Model

```typescript
type RegexFlag = 'g' | 'i' | 'm' | 's' | 'u' | 'y';

interface RegexMatch {
  index: number;
  value: string;
  groups: Record<string, string>;       // named capture groups
  captures: Array<string | undefined>;  // positional capture groups
}

interface RegexTestCase {
  id: string;
  text: string;
  hasMatch: boolean | null;             // null = not yet evaluated
}

interface RegexState {
  pattern: string;
  flags: Set<RegexFlag>;
  testInput: string;
  replaceWith: string;
  replacePreview: string | null;
  mode: 'test' | 'replace';
  matches: RegexMatch[];
  testCases: RegexTestCase[];
  error: string | null;
  showExplainer: boolean;
  explanation: RegexToken[] | null;
}

interface RegexToken {
  raw: string;             // the actual pattern characters for this token
  type: RegexTokenType;
  description: string;     // plain-English explanation
  children?: RegexToken[]; // for groups
}

type RegexTokenType =
  | 'anchor'
  | 'group'
  | 'non-capturing-group'
  | 'lookahead'
  | 'quantifier'
  | 'char-class'
  | 'escape'
  | 'alternation'
  | 'literal'
  | 'dot'
  | 'backreference';
```

---

## 7. Shared Platform Types

### Tool Registry

```typescript
interface ToolDefinition {
  slug: string;           // URL path segment
  name: string;           // Display name
  description: string;    // One-line description for cards
  category: ToolCategory;
  keywords: string[];     // SEO keywords
  icon: string;           // Lucide icon name
  route: string;          // Full URL path
}

type ToolCategory =
  | 'Productivity'
  | 'Data & Format'
  | 'Developer Utilities';

const TOOLS: ToolDefinition[] = [
  // Defined in lib/tools-registry.ts
];
```

### AdSense Config

```typescript
interface AdSlotConfig {
  slotId: string;
  format: 'horizontal' | 'rectangle' | 'responsive';
  minHeightPx: number;   // for CLS prevention
  minHeightMobilePx: number;
}

interface AdsConfig {
  publisherId: string;
  slots: {
    HEADER_BANNER: AdSlotConfig;
    SIDEBAR: AdSlotConfig;
    IN_CONTENT: AdSlotConfig;
  };
}
```

### SEO Metadata Helper Types

```typescript
interface ToolSEOData {
  title: string;                        // max 60 chars
  description: string;                  // 150-160 chars
  keywords: string[];
  canonicalPath: string;                // e.g. "/checklist"
  ogImagePath: string;                  // e.g. "/og/checklist.png"
  structuredData: SoftwareApplicationLD;
  faqStructuredData: FAQPageLD;
}

interface SoftwareApplicationLD {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: 'DeveloperApplication';
  operatingSystem: 'Any';
  offers: { '@type': 'Offer'; price: '0'; priceCurrency: 'USD' };
  url: string;
  description: string;
}

interface FAQPageLD {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }>;
}
```

---

## 8. localStorage Key Registry

| Key | Content | Written by | Read by |
|---|---|---|---|
| `devtools_theme` | `"dark"` \| `"light"` | ThemeProvider | Root layout inline script + ThemeProvider |
| `devtools_checklist_v1` | `ChecklistWorkspace` JSON | Checklist tool | Checklist tool on mount |

> No other localStorage keys are written. All other tool state is ephemeral.
