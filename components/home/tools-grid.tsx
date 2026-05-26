'use client'

import { useState, useMemo } from 'react'
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
} from 'lucide-react'

const tools = [
  {
    href: '/checklist',
    icon: CheckSquare,
    name: 'Smart Checklist',
    description: 'Organize complex tasks, workflows, and nested checklists with a fast, privacy-first checklist system.',
    secondary: 'Supports nested tasks, progress tracking, drag-and-drop organization, and shareable checklists.',
    tags: ['workflow planning', 'nested checklists', 'progress tracking', 'offline ready'],
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
          {/* Featured card */}
          {showFeatured && (
            <Link
              href={featuredTool.href}
              className="group relative sm:col-span-2 lg:col-span-2 rounded-xl border border-green-500/20 bg-card p-6 md:p-8 transition-all duration-300 hover:border-green-500/40 hover:-translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 group-hover:bg-green-500/15 transition-colors">
                    <featuredTool.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg leading-none">{featuredTool.name}</h3>
                    <span className="inline-flex items-center rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Open <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/80 leading-relaxed mb-1.5 max-w-lg font-medium">
                    {featuredTool.description}
                  </p>
                  {featuredTool.secondary && (
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 max-w-lg">
                      {featuredTool.secondary}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {featuredTool.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md text-xs border border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mini nested checklist preview */}
                <div className="shrink-0 hidden sm:flex flex-col gap-1.5 rounded-lg border border-border/40 bg-muted/20 px-4 py-3.5 w-56 self-stretch justify-center" aria-hidden="true">
                  {[
                    { label: 'Q3 Planning',      depth: 0, done: true  },
                    { label: 'Set priorities',   depth: 1, done: true  },
                    { label: 'Assign owners',    depth: 1, done: true  },
                    { label: 'Launch campaign',  depth: 0, done: false },
                    { label: 'Review assets',    depth: 1, done: false },
                    { label: 'Schedule publish', depth: 1, done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5" style={{ paddingLeft: item.depth * 14 }}>
                      <div className={`h-3 w-3 rounded-sm border shrink-0 flex items-center justify-center ${item.done ? 'bg-green-500 border-green-500' : 'border-border/60 bg-transparent'}`}>
                        {item.done && (
                          <svg viewBox="0 0 10 10" className="h-2 w-2 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1.5,5 4,7.5 8.5,2" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[10px] truncate ${item.done ? 'text-muted-foreground/40 line-through' : 'text-foreground/60'}`}>{item.label}</span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-muted-foreground/40">3 of 6 done</span>
                      <span className="text-[9px] text-green-500/70 font-medium">50%</span>
                    </div>
                    <div className="h-0.5 w-full rounded-full bg-border/40 overflow-hidden">
                      <div className="h-full w-1/2 rounded-full bg-green-500/60 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
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
