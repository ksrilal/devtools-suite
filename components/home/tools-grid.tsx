'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  CheckSquare,
  Braces,
  Clock,
  GitCompare,
  KeyRound,
  RegexIcon,
  ArrowRight,
  FileCode2,
  Fingerprint,
  Link2,
  FileText,
  Database,
  Palette,
  Hash,
  FileJson,
  Table2,
  Clock3,
  CaseSensitive,
  KeySquare,
  FileBadge,
  Code2,
  QrCode,
  LayoutTemplate,
  Send,
  FileSearch,
  ShieldCheck,
  BookOpen,
  Wind,
  Cog,
  Container,
  Search,
  X,
  Plus,
  Star,
  FolderOpen,
  ChevronRight,
  Layers,
  Share2,
  Download,
} from 'lucide-react'

// ─── Floating checkbox animation ─────────────────────────────────────────────

type BoxMark = 'none' | 'check' | 'cross'
interface FloatBox {
  id: number
  size: number      // px 14–26
  topPct: number    // % vertically
  leftPct: number   // % — starting X position
  dur: number       // drift duration ms
  markDelay: number // ms before mark pops in
  mark: BoxMark
}

function FloatingCheckboxes() {
  const [boxes, setBoxes] = useState<FloatBox[]>([])
  const counter = useRef(0)

  useEffect(() => {
    const MARKS: BoxMark[] = ['check', 'check', 'cross', 'cross', 'none']

    function spawn() {
      const id = counter.current++
      const dur = 4800 + Math.random() * 2000 // 4.8–6.8s drift
      const box: FloatBox = {
        id,
        size: 14 + Math.floor(Math.random() * 14),
        topPct: 8 + Math.random() * 72,
        leftPct: Math.random() * 60, // start in left 0–60% so it has room to drift right
        dur,
        markDelay: dur * 0.25 + Math.random() * (dur * 0.35), // mark appears 25–60% into drift
        mark: MARKS[Math.floor(Math.random() * MARKS.length)] ?? 'none',
      }
      setBoxes((prev) => [...prev.slice(-9), box])
      setTimeout(() => setBoxes((prev) => prev.filter((b) => b.id !== id)), dur + 400)
    }

    // initial burst — populate immediately
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 220)
    const iv = setInterval(spawn, 950)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <style>{`
        @keyframes fb-drift {
          from { transform: translateX(0);    opacity: 0; }
          6%   { opacity: 1; }
          88%  { opacity: 1; }
          to   { transform: translateX(55vw); opacity: 0; }
        }
        @keyframes fb-mark {
          from { opacity: 0; transform: scale(0.2); }
          to   { opacity: 1; transform: scale(1); }
        }
        .fb-box  { position: absolute; display: flex; align-items: center; justify-content: center; border-radius: 3px; }
        .fb-mark { animation: fb-mark 0.22s cubic-bezier(.34,1.56,.64,1) forwards; opacity: 0; }
      `}</style>

      {boxes.map((box) => {
        const isCheck = box.mark === 'check'
        const isCross = box.mark === 'cross'
        const border = isCheck ? '#22c55e' : isCross ? '#ef4444' : 'rgba(200,210,220,0.75)'
        const bg     = isCheck ? 'rgba(34,197,94,0.13)' : isCross ? 'rgba(239,68,68,0.11)' : 'rgba(200,210,220,0.06)'
        return (
          <div
            key={box.id}
            className="fb-box"
            style={{
              top:    `${box.topPct}%`,
              left:   `${box.leftPct}%`,
              width:  box.size,
              height: box.size,
              border: `1.5px solid ${border}`,
              background: bg,
              animation: `fb-drift ${box.dur}ms linear forwards`,
            }}
          >
            {box.mark !== 'none' && (
              <span className="fb-mark" style={{ animationDelay: `${box.markDelay}ms` }}>
                {isCheck ? (
                  <svg viewBox="0 0 10 10" fill="none" stroke="#22c55e" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ width: box.size * 0.6, height: box.size * 0.6 }}>
                    <polyline points="1.5,5 4,7.5 8.5,2.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 10 10" fill="none" stroke="#ef4444" strokeWidth="2.2"
                    strokeLinecap="round"
                    style={{ width: box.size * 0.6, height: box.size * 0.6 }}>
                    <line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" />
                  </svg>
                )}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

const CHECKLIST_DESTINATIONS = [
  {
    href: '/checklist/workspace',
    icon: Plus,
    label: 'New Workspace',
    description: 'Paste any list or start blank — simple or nested',
  },
  {
    href: '/checklist/templates',
    icon: Star,
    label: 'Templates',
    description: '60+ ready-made checklists across 16 categories',
  },
  {
    href: '/checklist/my-checklists',
    icon: FolderOpen,
    label: 'My Checklists',
    description: 'Your saved checklists — pin, rename, duplicate',
  },
]

const CHECKLIST_HIGHLIGHTS = [
  { icon: Layers,   text: 'Simple & Advanced modes — flat list or 3-level nested hierarchy' },
  { icon: Share2,   text: 'Shareable URLs — recipients get a named copy instantly' },
  { icon: Download, text: 'Export to PDF, Markdown, JSON, CSV, or plain text' },
]

const tools = [
  {
    href: '/checklist',
    icon: CheckSquare,
    name: 'Smart Checklist',
    description: 'Organize tasks, workflows, and nested checklists with a fast, privacy-first checklist system.',
    tags: ['nested tasks', 'progress tracking', 'shareable', '60+ templates', 'auto-saved'],
    featured: true,
  },
  {
    href: '/json-formatter',
    icon: Braces,
    name: 'JSON Formatter',
    description: 'Prettify, minify, validate and explore JSON with syntax highlighting.',
    tags: ['json beautifier', 'json validator'],
  },
  {
    href: '/cron-generator',
    icon: Clock,
    name: 'Cron Generator',
    description: 'Build cron expressions visually. Supports Unix, AWS EventBridge and Spring.',
    tags: ['cron builder', 'cron parser'],
  },
  {
    href: '/diff-checker',
    icon: GitCompare,
    name: 'Diff Checker',
    description: 'Compare text side-by-side with line, character and JSON-aware diffing.',
    tags: ['compare text', 'json diff'],
  },
  {
    href: '/jwt-decoder',
    icon: KeyRound,
    name: 'JWT Decoder',
    description: 'Decode JWT tokens and inspect claims without sending tokens anywhere.',
    tags: ['decode jwt', 'jwt inspector'],
  },
  {
    href: '/regex-tester',
    icon: RegexIcon,
    name: 'Regex Tester',
    description: 'Test regular expressions live with match highlighting and replace preview.',
    tags: ['regex checker', 'regex validator'],
  },
  {
    href: '/base64-encoder-decoder',
    icon: FileCode2,
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text instantly.',
    tags: ['base64 encoder', 'base64 decoder'],
  },
  {
    href: '/uuid-generator',
    icon: Fingerprint,
    name: 'UUID Generator',
    description: 'Generate cryptographically random UUID v4 values. Copy one or all at once.',
    tags: ['uuid v4', 'guid generator'],
  },
  {
    href: '/url-encoder-decoder',
    icon: Link2,
    name: 'URL Encoder / Decoder',
    description: 'Percent-encode URLs or decode encoded URL strings — real-time conversion.',
    tags: ['url encoder', 'percent encoding'],
  },
  {
    href: '/markdown-previewer',
    icon: FileText,
    name: 'Markdown Previewer',
    description: 'Write Markdown with a live GitHub-style preview. Sanitized and real-time.',
    tags: ['markdown editor', 'live preview'],
  },
  {
    href: '/sql-formatter',
    icon: Database,
    name: 'SQL Formatter',
    description: 'Beautify or minify SQL queries with dialect-aware formatting. Supports MySQL, PostgreSQL, and more.',
    tags: ['sql beautifier', 'format sql'],
  },
  {
    href: '/color-converter',
    icon: Palette,
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL with a live color swatch and picker.',
    tags: ['hex to rgb', 'color picker'],
  },
  {
    href: '/hash-generator',
    icon: Hash,
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using browser-native Web Crypto.',
    tags: ['sha256', 'md5 hash'],
  },
  {
    href: '/yaml-json-converter',
    icon: FileJson,
    name: 'YAML ↔ JSON Converter',
    description: 'Convert between YAML and JSON with validation and pretty-printing. Supports full YAML 1.2.',
    tags: ['yaml to json', 'json to yaml'],
  },
  {
    href: '/json-ts-generator',
    icon: Braces,
    name: 'JSON → TypeScript',
    description: 'Generate typed TypeScript interfaces from JSON. Handles nested objects and arrays automatically.',
    tags: ['json to typescript', 'ts interfaces'],
  },
  {
    href: '/csv-json-converter',
    icon: Table2,
    name: 'CSV ↔ JSON Converter',
    description: 'Convert CSV to JSON or JSON arrays to CSV. Upload files or paste directly.',
    tags: ['csv to json', 'json to csv'],
  },
  {
    href: '/timestamp-converter',
    icon: Clock3,
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.',
    tags: ['unix timestamp', 'epoch converter'],
  },
  {
    href: '/case-converter',
    icon: CaseSensitive,
    name: 'Case Converter',
    description: 'Convert text between camelCase, snake_case, PascalCase, kebab-case, and more in real-time.',
    tags: ['camelcase', 'snake_case'],
  },
  {
    href: '/password-generator',
    icon: KeySquare,
    name: 'Password Generator',
    description: 'Generate cryptographically secure passwords with configurable length and character sets.',
    tags: ['secure password', 'random password'],
  },
  {
    href: '/jwt-generator',
    icon: FileBadge,
    name: 'JWT Generator',
    description: 'Generate and sign JWT tokens locally with HS256. Edit header, payload, and secret live.',
    tags: ['jwt sign', 'hs256 jwt'],
  },
  {
    href: '/xml-formatter',
    icon: Code2,
    name: 'XML Formatter',
    description: 'Pretty-print or minify XML with validation. Reports errors with line numbers.',
    tags: ['xml beautifier', 'format xml'],
  },
  {
    href: '/qr-code-generator',
    icon: QrCode,
    name: 'QR Code Generator',
    description: 'Generate QR codes from any text or URL. Download as PNG. Adjustable size and colors.',
    tags: ['qr code', 'qr generator'],
  },
  {
    href: '/json-zod-generator',
    icon: FileSearch,
    name: 'JSON → Zod Schema',
    description: 'Generate typed Zod schemas from JSON. Supports nested objects, arrays, and strict mode.',
    tags: ['zod schema', 'typescript zod'],
  },
  {
    href: '/flexbox-playground',
    icon: LayoutTemplate,
    name: 'Flexbox Playground',
    description: 'Experiment with CSS Flexbox properties interactively. Live preview with generated CSS output.',
    tags: ['css flexbox', 'layout tool'],
  },
  {
    href: '/api-request-builder',
    icon: Send,
    name: 'API Request Builder',
    description: 'Build and send HTTP requests from your browser. Inspect responses and copy cURL commands.',
    tags: ['http client', 'rest tester'],
  },
  {
    href: '/json-schema-generator',
    icon: ShieldCheck,
    name: 'JSON Schema Generator',
    description: 'Generate JSON Schema (draft 2020-12) from any JSON object with nested object support.',
    tags: ['json schema', 'json validation'],
  },
  {
    href: '/bcrypt-generator',
    icon: ShieldCheck,
    name: 'Bcrypt Generator',
    description: 'Generate and verify bcrypt hashes locally. Adjustable salt rounds. No data transmitted.',
    tags: ['bcrypt hash', 'password hash'],
  },
  {
    href: '/openapi-viewer',
    icon: BookOpen,
    name: 'OpenAPI Viewer',
    description: 'Browse OpenAPI 3.x and Swagger specs locally. Search endpoints, view parameters and responses.',
    tags: ['openapi', 'swagger viewer'],
  },
  {
    href: '/tailwind-playground',
    icon: Wind,
    name: 'Tailwind Playground',
    description: 'Experiment with Tailwind CSS classes live. Desktop/mobile preview toggle and preset snippets.',
    tags: ['tailwind css', 'css playground'],
  },
  {
    href: '/json-to-dart',
    icon: Cog,
    name: 'JSON → Dart Models',
    description: 'Generate Dart model classes from JSON. Supports null safety and fromJson/toJson for Flutter.',
    tags: ['dart model', 'flutter json'],
  },
  {
    href: '/json-to-csharp',
    icon: Cog,
    name: 'JSON → C# Classes',
    description: 'Generate C# model classes from JSON with PascalCase, System.Text.Json attributes, and namespaces.',
    tags: ['c# model', 'csharp json'],
  },
  {
    href: '/docker-compose-formatter',
    icon: Container,
    name: 'Docker Compose Formatter',
    description: 'Beautify and validate docker-compose YAML files with minify support. Browser-only, no uploads.',
    tags: ['docker compose', 'yaml formatter'],
  },
]

// tools[0] is always defined — the array is a non-empty literal
const featuredTool = tools[0] as typeof tools[0]
const otherToolsList = tools.slice(1)

export function ToolsGrid() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const filteredOther = useMemo(() => {
    if (!q) return otherToolsList
    return otherToolsList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }, [q])

  const showFeatured =
    !q ||
    featuredTool.name.toLowerCase().includes(q) ||
    featuredTool.description.toLowerCase().includes(q) ||
    featuredTool.tags.some((tag) => tag.toLowerCase().includes(q))

  const totalVisible = (showFeatured ? 1 : 0) + filteredOther.length

  return (
    <>
      {/* Title row with inline search */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">All Tools</h2>
          <p className="text-muted-foreground text-sm">Click any tool to open it instantly. No loading screens.</p>
        </div>
        <div className="relative shrink-0 w-64 sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {totalVisible === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No tools match <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Featured card — split layout */}
          {showFeatured && (
            <div className="relative sm:col-span-2 lg:col-span-2 rounded-xl border border-green-500/20 bg-card overflow-hidden">
              {/* Subtle gradient wash */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/[0.04] via-transparent to-transparent" aria-hidden="true" />

              {/* Header row */}
              <div className="relative flex items-center gap-3 px-6 pt-6 pb-5 border-b border-green-500/10 overflow-hidden">
                {/* Floating checkboxes — absolute, spans full header */}
                <div className="hidden sm:block absolute inset-0 pointer-events-none" aria-hidden="true">
                  <FloatingCheckboxes />
                </div>

                <div className="relative z-10 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500">
                  <featuredTool.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="relative z-10 flex items-center gap-2">
                  <h3 className="font-semibold text-lg leading-none">{featuredTool.name}</h3>
                  <span className="inline-flex items-center rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wide">
                    Featured
                  </span>
                </div>
              </div>

              {/* Body — split */}
              <div className="flex flex-col sm:flex-row">

                {/* Left: description + highlights + tags */}
                <div className="flex-1 min-w-0 px-6 py-5">
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4 font-medium">
                    {featuredTool.description}
                  </p>
                  <ul className="space-y-2 mb-5">
                    {CHECKLIST_HIGHLIGHTS.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-500/70" aria-hidden="true" />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredTool.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md text-xs border border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-green-500/10" />
                <div className="block sm:hidden h-px bg-green-500/10 mx-6" />

                {/* Right: 3 destination links */}
                <div className="shrink-0 flex flex-col divide-y divide-green-500/10 w-64">
                  {CHECKLIST_DESTINATIONS.map(({ href, icon: Icon, label, description }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group/dest relative flex items-center gap-3 px-5 py-4 hover:bg-green-500/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      {/* Left-side popover — appears over the left content, never shifts layout */}
                      <span className="pointer-events-none absolute right-[calc(100%+6px)] top-1/2 -translate-y-1/2 z-30 whitespace-nowrap rounded-md border border-green-500/20 bg-card/95 px-3 py-1.5 text-[11px] text-green-400 shadow-lg backdrop-blur-sm opacity-0 -translate-x-1 group-hover/dest:opacity-100 group-hover/dest:translate-x-0 transition-all duration-200">
                        {description}
                      </span>

                      <div className="p-1.5 rounded-md bg-green-500/10 border border-green-500/15 text-green-500 shrink-0 group-hover/dest:bg-green-500/20 transition-colors">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none transition-all duration-200 mb-0.5 group-hover/dest:mb-0 group-hover/dest:translate-y-[7px]">{label}</p>
                        <p className="text-[11px] text-muted-foreground leading-snug truncate transition-opacity duration-150 group-hover/dest:opacity-0">{description}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover/dest:text-green-500/60 group-hover/dest:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* Regular cards */}
          {filteredOther.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:-translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden"
              >
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/4 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-foreground/8 border border-border/60 text-foreground group-hover:border-foreground/20 transition-colors">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true" />
                </div>

                <h3 className="font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-xs border border-border/50 text-muted-foreground/70 bg-muted/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
