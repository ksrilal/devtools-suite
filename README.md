# DevTools Suite

> Free, privacy-first developer tools that run entirely in your browser.

**[devtoolssuite.dev](https://devtoolssuite.dev)** — No login. No uploads. No tracking.

---

## Tools

| Tool | Description |
|------|-------------|
| [Smart Checklist](https://devtoolssuite.dev/checklist) | Convert any text into an interactive checklist with drag-and-drop, PDF export, and shareable URLs |
| [JSON Formatter](https://devtoolssuite.dev/json-formatter) | Prettify, minify, validate and explore JSON with syntax highlighting |
| [Cron Generator](https://devtoolssuite.dev/cron-generator) | Build cron expressions visually with human-readable descriptions and next-execution previews |
| [Diff Checker](https://devtoolssuite.dev/diff-checker) | Compare two texts side by side with line, character, and JSON-aware diff modes |
| [JWT Decoder](https://devtoolssuite.dev/jwt-decoder) | Decode JWT tokens and inspect header, payload, and expiry claims |
| [Regex Tester](https://devtoolssuite.dev/regex-tester) | Test regular expressions live with match highlighting, flags, and replace preview |

---

## Philosophy

- **Privacy first** — all processing happens locally in your browser. Your data never leaves your device.
- **Zero friction** — open a tool and use it immediately. No accounts, no onboarding, no paywalls.
- **Fast** — static pages, minimal JavaScript, optimized for instant load times.
- **Accessible** — keyboard navigation, screen reader support, dark/light mode.

---

## Tech Stack

- [Next.js 14](https://nextjs.org) — App Router, static generation
- [TypeScript](https://www.typescriptlang.org) — strict mode
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com) — accessible component primitives
- [@dnd-kit](https://dndkit.com) — drag-and-drop for the checklist
- Deployed on [Vercel](https://vercel.com)

---

## Running Locally

```bash
git clone https://github.com/ksrilal/devtools-suite.git
cd devtools-suite
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file (optional — all tools work without these):

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADSENSE_CLIENT_ID=    # Google AdSense publisher ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=    # Google Analytics 4 measurement ID
```

---

## Project Structure

```
app/                  # Next.js App Router pages
  checklist/
  json-formatter/
  cron-generator/
  diff-checker/
  jwt-decoder/
  regex-tester/
components/
  tools/              # Tool UI components
  home/               # Homepage preview animations
  layout/             # Nav, Footer
  ui/                 # Shared UI (Button, AdSlot, etc.)
lib/
  tools/              # Core tool logic (pure functions, no React)
  seo/                # Metadata helpers
```

---

## License

MIT — free to use, fork, and build upon.
