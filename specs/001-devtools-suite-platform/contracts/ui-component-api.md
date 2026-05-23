# Interface Contracts: Shared UI Components

**Phase**: 1 — Design
**Date**: 2026-05-23

> Props interfaces for every shared component in `components/shared/`.
> These define the stable contracts consumed by all tool pages.

---

## ToolLayout

```typescript
// components/shared/ToolLayout.tsx
// Server Component wrapper — renders nav, ads, footer, SEO shell

interface ToolLayoutProps {
  children: React.ReactNode;
  /** Tool-specific structured data injected into <head> */
  structuredData?: object | object[];
}
```

---

## Toolbar

```typescript
// components/shared/Toolbar.tsx
// 'use client' — sticky action bar

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'ghost' | 'destructive';
  shortcut?: string;          // display hint e.g. "⌘↩"
}

interface ToolbarProps {
  actions: ToolbarAction[];
  title?: string;             // tool name for mobile header
  className?: string;
}
```

---

## AdSlot

```typescript
// components/shared/AdSlot.tsx
// 'use client' — renders AdSense ins element

type AdSlotVariant = 'header-banner' | 'sidebar' | 'in-content';

interface AdSlotProps {
  variant: AdSlotVariant;
  className?: string;
}
```

---

## CopyButton

```typescript
// components/shared/CopyButton.tsx
// 'use client'

interface CopyButtonProps {
  getValue: () => string;     // called at click-time, not during render
  label?: string;             // defaults to "Copy"
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

---

## DownloadButton

```typescript
// components/shared/DownloadButton.tsx
// 'use client'

interface DownloadButtonProps {
  getContent: () => string;   // called at click-time
  filename: string;
  mimeType?: string;          // defaults to "text/plain"
  label?: string;             // defaults to "Download"
  className?: string;
}
```

---

## ShareButton

```typescript
// components/shared/ShareButton.tsx
// 'use client'

interface ShareButtonProps {
  getURL: () => string;       // called at click-time, returns full URL
  label?: string;             // defaults to "Share"
  className?: string;
}
```

---

## KeyboardShortcutModal

```typescript
// components/shared/KeyboardShortcutModal.tsx
// 'use client'

interface ShortcutEntry {
  keys: string[];             // e.g. ["Ctrl", "Enter"]
  description: string;
}

interface KeyboardShortcutModalProps {
  shortcuts: ShortcutEntry[];
  trigger?: React.ReactNode;  // defaults to "?" icon button
}
```

---

## ThemeProvider

```typescript
// components/shared/ThemeProvider.tsx
// 'use client'

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;        // defaults to "system"
  storageKey?: string;         // defaults to "devtools_theme"
}

// Exposed via context:
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}
```

---

## Nav

```typescript
// components/shared/Nav.tsx
// Server Component (no interactivity; theme toggle is a client island)

interface NavProps {
  currentPath?: string;        // for active link highlighting
}
```

---

## ToolCard (Homepage)

```typescript
// components/shared/ToolCard.tsx
// Server Component

interface ToolCardProps {
  tool: ToolDefinition;
  className?: string;
}
```

---

## SplitPane

```typescript
// components/shared/SplitPane.tsx
// 'use client' — responsive side-by-side pane layout

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
  syncScroll?: boolean;         // synchronise vertical scroll between panes
  className?: string;
}
```

---

## PrivacyNotice

```typescript
// components/shared/PrivacyNotice.tsx
// Server Component — static inline notice

interface PrivacyNoticeProps {
  toolName: string;
  className?: string;
}
// Renders: "🔒 {toolName} processes all data locally in your browser. Nothing is sent to any server."
```

---

## FAQSection

```typescript
// components/shared/FAQSection.tsx
// Server Component — renders FAQ accordion from static data

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  className?: string;
}
```

---

## ToolDescription

```typescript
// components/shared/ToolDescription.tsx
// Server Component — renders the 150-300 word SEO description block

interface ToolDescriptionProps {
  children: React.ReactNode;   // MDX or JSX prose content
  className?: string;
}
```
