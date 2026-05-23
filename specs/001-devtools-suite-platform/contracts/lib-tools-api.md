# Interface Contracts: lib/tools/* Pure Function APIs

**Phase**: 1 — Design
**Date**: 2026-05-23

> These are the TypeScript function signatures for every pure-logic module in `lib/tools/`.
> All functions are synchronous, side-effect free, and have zero DOM/React dependencies.
> They constitute the internal "contract" between the UI layer and the logic layer.

---

## lib/tools/checklist.ts

```typescript
/** Parse any mixed-separator text into an array of ChecklistItems */
export function parseChecklistInput(raw: string): ChecklistItem[];

/** Serialise workspace to a URL-safe compressed string */
export function encodeChecklistToURL(workspace: ChecklistWorkspace): string;

/** Deserialise a URL-safe compressed string back to workspace state */
export function decodeChecklistFromURL(encoded: string): ChecklistWorkspace | null;

/** Export items as plain text (one per line) */
export function exportAsPlainText(items: ChecklistItem[]): string;

/** Export items as Markdown checkboxes */
export function exportAsMarkdown(items: ChecklistItem[]): string;

/** Export items as CSV (text, state columns) */
export function exportAsCSV(items: ChecklistItem[]): string;

/** Transition an item's state according to the action */
export function transitionState(
  current: ChecklistState,
  action: 'toggle' | 'invalidate'
): ChecklistState;

/** Filter items by search query (case-insensitive substring) */
export function filterItems(
  items: ChecklistItem[],
  query: string
): ChecklistItem[];

/** Compute progress: { checked, total, percent } */
export function computeProgress(items: ChecklistItem[]): {
  checked: number;
  total: number;
  percent: number;
};
```

---

## lib/tools/json-formatter.ts

```typescript
/** Parse and format JSON input */
export function formatJSON(
  input: string,
  options: { indentSize: 2 | 4; sortKeys: boolean }
): { formatted: string; error: null } | { formatted: null; error: JSONFormatterError };

/** Minify JSON (remove all whitespace) */
export function minifyJSON(
  input: string
): { minified: string; error: null } | { minified: null; error: JSONFormatterError };

/** Tokenise a JSON string for syntax highlighting */
export function tokeniseJSON(
  json: string
): JSONToken[];

interface JSONToken {
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'whitespace';
  value: string;
  escapedValue: string;  // HTML-escaped, safe for dangerouslySetInnerHTML
}

/** Sort all object keys recursively */
export function sortJSONKeys(obj: unknown): unknown;

/** Extract error location from a JSON.parse SyntaxError message */
export function parseJSONError(error: SyntaxError, input: string): JSONFormatterError;
```

---

## lib/tools/cron-generator.ts

```typescript
/** Validate a single cron field value */
export function validateCronField(
  value: string,
  field: CronFieldName
): { valid: true } | { valid: false; message: string };

type CronFieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

/** Assemble 5 fields into a cron expression string */
export function buildExpression(fields: CronFieldValues): string;

interface CronFieldValues {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

/** Parse a cron expression string into individual field values */
export function parseExpression(expression: string): CronFieldValues | null;

/** Convert Unix cron to AWS EventBridge format */
export function toEventBridge(expression: string): string;

/** Convert Unix cron to Spring @Scheduled format */
export function toSpringScheduled(expression: string): string;

/** Convert Unix cron to Quartz format */
export function toQuartz(expression: string): string;

/** Compute next N execution Date objects from a cron expression */
export function getNextExecutions(
  expression: string,
  count: number,
  from?: Date
): Date[];
```

---

## lib/tools/diff-checker.ts

```typescript
/** Compute line-level diff between two strings */
export function diffLines(
  left: string,
  right: string,
  options?: DiffOptions
): DiffChange[];

/** Compute character-level diff within a single changed line */
export function diffChars(left: string, right: string): DiffChange[];

/** Compute structural JSON diff (key-order agnostic) */
export function diffJSON(
  leftJSON: string,
  rightJSON: string
): DiffChange[];

interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
}

interface DiffChange {
  type: 'added' | 'removed' | 'equal';
  value: string;
}

/** Summarise a diff result */
export function summariseDiff(changes: DiffChange[]): {
  added: number;
  removed: number;
  changed: number;
};

/** Format diff changes as a unified .diff string */
export function formatAsPatch(changes: DiffChange[], leftName?: string, rightName?: string): string;
```

---

## lib/tools/jwt-decoder.ts

```typescript
/** Decode a JWT string into its parts (no signature verification) */
export function decodeJWT(token: string): JWTDecoded | null;

/** Compute human-readable expiry status from a decoded JWT */
export function getExpiryStatus(payload: JWTClaims): JWTExpiryStatus;

/** Format a Unix timestamp as a human-readable relative string */
export function formatRelativeTime(timestamp: number): string;
// e.g. "in 23 minutes", "expired 3 days ago", "5 hours ago"

/** Annotate all standard claims with human-readable labels */
export function annotateStandardClaims(
  payload: JWTClaims
): Array<{ key: string; value: unknown; label: string | null; formatted: string | null }>;
```

---

## lib/tools/regex-tester.ts

```typescript
/** Safely compile a regex pattern with flags, returning null on syntax error */
export function compileRegex(
  pattern: string,
  flags: string
): { regex: RegExp; error: null } | { regex: null; error: string };

/** Find all matches in a test string */
export function findMatches(regex: RegExp, input: string): RegexMatch[];

/** Preview replacement result */
export function previewReplace(
  regex: RegExp,
  input: string,
  replacement: string
): string;

/** Test whether a regex matches a given string */
export function testMatch(regex: RegExp, input: string): boolean;

/** Produce a plain-English explanation of a regex pattern */
export function explainRegex(pattern: string): RegexToken[];

/** Tokenise a regex pattern string for syntax highlighting */
export function tokeniseRegex(pattern: string): RegexSyntaxToken[];

interface RegexSyntaxToken {
  type: 'group' | 'quantifier' | 'anchor' | 'char-class' | 'escape' | 'alternation' | 'literal';
  value: string;
}
```

---

## lib/utils.ts (shared helpers)

```typescript
/** Tailwind class merge utility (re-export of clsx + twMerge) */
export function cn(...inputs: ClassValue[]): string;

/** Copy text to clipboard, return success boolean */
export async function copyToClipboard(text: string): Promise<boolean>;

/** Trigger browser file download */
export function downloadFile(content: string, filename: string, mimeType: string): void;

/** Read a File object as text */
export function readFileAsText(file: File): Promise<string>;

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void;

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string;

/** Safe localStorage get with JSON parsing */
export function localStorageGet<T>(key: string, fallback: T): T;

/** Safe localStorage set with JSON serialisation */
export function localStorageSet(key: string, value: unknown): void;
```
