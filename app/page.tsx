import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckSquare,
  Braces,
  Clock,
  GitCompare,
  KeyRound,
  RegexIcon,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Heart,
  FileCode2,
  Fingerprint,
  Link2,
  FileText,
  Database,
  Palette,
  Hash,
  FileJson,
  Braces as BracesTS,
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
} from 'lucide-react'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { ChecklistPreviewPanel } from '@/components/home/checklist-preview'
import { CronPreviewPanel } from '@/components/home/cron-preview'
import { RegexPreviewPanel } from '@/components/home/regex-preview'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'DevTools Suite – Free Online Developer Tools | JSON, UUID, Base64, SQL, Regex & More',
  description:
    'Free privacy-first developer tools that run entirely in your browser. JSON formatter, JWT decoder, regex tester, UUID generator, Base64 encoder, URL encoder, SQL formatter, color converter, hash generator, YAML converter, and more. No login, no uploads, no tracking.',
  path: '/',
  keywords: [
    'developer tools online',
    'free developer tools',
    'json formatter online',
    'jwt decoder',
    'regex tester online',
    'cron expression generator',
    'diff checker online',
    'online checklist maker',
    'base64 encoder decoder',
    'uuid generator',
    'url encoder decoder',
    'markdown previewer',
    'sql formatter',
    'color converter',
    'hash generator',
    'yaml to json converter',
    'browser developer tools',
    'privacy first tools',
    'no login tools',
  ],
})

const tools = [
  {
    href: '/checklist',
    icon: CheckSquare,
    name: 'Smart Checklist',
    description:
      'Plan releases, deployments, migrations, and QA workflows with a powerful nested checklist system built for developers.',
    secondary: 'Supports nested tasks, progress tracking, drag-and-drop organization, and shareable checklists.',
    tags: ['release workflows', 'QA tracking', 'nested checklists'],
    featured: true,
  },
  {
    href: '/json-formatter',
    icon: Braces,
    name: 'JSON Formatter',
    description: 'Prettify, minify, validate and explore JSON with syntax highlighting.',
    tags: ['json beautifier', 'json validator'],
    featured: false,
  },
  {
    href: '/cron-generator',
    icon: Clock,
    name: 'Cron Generator',
    description: 'Build cron expressions visually. Supports Unix, AWS EventBridge and Spring.',
    tags: ['cron builder', 'cron parser'],
    featured: false,
  },
  {
    href: '/diff-checker',
    icon: GitCompare,
    name: 'Diff Checker',
    description: 'Compare text side-by-side with line, character and JSON-aware diffing.',
    tags: ['compare text', 'json diff'],
    featured: false,
  },
  {
    href: '/jwt-decoder',
    icon: KeyRound,
    name: 'JWT Decoder',
    description: 'Decode JWT tokens and inspect claims without sending tokens anywhere.',
    tags: ['decode jwt', 'jwt inspector'],
    featured: false,
  },
  {
    href: '/regex-tester',
    icon: RegexIcon,
    name: 'Regex Tester',
    description: 'Test regular expressions live with match highlighting and replace preview.',
    tags: ['regex checker', 'regex validator'],
    featured: false,
  },
  {
    href: '/base64-encoder-decoder',
    icon: FileCode2,
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text instantly.',
    tags: ['base64 encoder', 'base64 decoder'],
    featured: false,
  },
  {
    href: '/uuid-generator',
    icon: Fingerprint,
    name: 'UUID Generator',
    description: 'Generate cryptographically random UUID v4 values. Copy one or all at once.',
    tags: ['uuid v4', 'guid generator'],
    featured: false,
  },
  {
    href: '/url-encoder-decoder',
    icon: Link2,
    name: 'URL Encoder / Decoder',
    description: 'Percent-encode URLs or decode encoded URL strings — real-time conversion.',
    tags: ['url encoder', 'percent encoding'],
    featured: false,
  },
  {
    href: '/markdown-previewer',
    icon: FileText,
    name: 'Markdown Previewer',
    description: 'Write Markdown with a live GitHub-style preview. Sanitized and real-time.',
    tags: ['markdown editor', 'live preview'],
    featured: false,
  },
  {
    href: '/sql-formatter',
    icon: Database,
    name: 'SQL Formatter',
    description: 'Beautify or minify SQL queries with dialect-aware formatting. Supports MySQL, PostgreSQL, and more.',
    tags: ['sql beautifier', 'format sql'],
    featured: false,
  },
  {
    href: '/color-converter',
    icon: Palette,
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL with a live color swatch and picker.',
    tags: ['hex to rgb', 'color picker'],
    featured: false,
  },
  {
    href: '/hash-generator',
    icon: Hash,
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using browser-native Web Crypto.',
    tags: ['sha256', 'md5 hash'],
    featured: false,
  },
  {
    href: '/yaml-json-converter',
    icon: FileJson,
    name: 'YAML ↔ JSON Converter',
    description: 'Convert between YAML and JSON with validation and pretty-printing. Supports full YAML 1.2.',
    tags: ['yaml to json', 'json to yaml'],
    featured: false,
  },
  {
    href: '/json-ts-generator',
    icon: BracesTS,
    name: 'JSON → TypeScript',
    description: 'Generate typed TypeScript interfaces from JSON. Handles nested objects and arrays automatically.',
    tags: ['json to typescript', 'ts interfaces'],
    featured: false,
  },
  {
    href: '/csv-json-converter',
    icon: Table2,
    name: 'CSV ↔ JSON Converter',
    description: 'Convert CSV to JSON or JSON arrays to CSV. Upload files or paste directly.',
    tags: ['csv to json', 'json to csv'],
    featured: false,
  },
  {
    href: '/timestamp-converter',
    icon: Clock3,
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.',
    tags: ['unix timestamp', 'epoch converter'],
    featured: false,
  },
  {
    href: '/case-converter',
    icon: CaseSensitive,
    name: 'Case Converter',
    description: 'Convert text between camelCase, snake_case, PascalCase, kebab-case, and more in real-time.',
    tags: ['camelcase', 'snake_case'],
    featured: false,
  },
  {
    href: '/password-generator',
    icon: KeySquare,
    name: 'Password Generator',
    description: 'Generate cryptographically secure passwords with configurable length and character sets.',
    tags: ['secure password', 'random password'],
    featured: false,
  },
  {
    href: '/jwt-generator',
    icon: FileBadge,
    name: 'JWT Generator',
    description: 'Generate and sign JWT tokens locally with HS256. Edit header, payload, and secret live.',
    tags: ['jwt sign', 'hs256 jwt'],
    featured: false,
  },
  {
    href: '/xml-formatter',
    icon: Code2,
    name: 'XML Formatter',
    description: 'Pretty-print or minify XML with validation. Reports errors with line numbers.',
    tags: ['xml beautifier', 'format xml'],
    featured: false,
  },
  {
    href: '/qr-code-generator',
    icon: QrCode,
    name: 'QR Code Generator',
    description: 'Generate QR codes from any text or URL. Download as PNG. Adjustable size and colors.',
    tags: ['qr code', 'qr generator'],
    featured: false,
  },
  {
    href: '/json-zod-generator',
    icon: FileSearch,
    name: 'JSON → Zod Schema',
    description: 'Generate typed Zod schemas from JSON. Supports nested objects, arrays, and strict mode.',
    tags: ['zod schema', 'typescript zod'],
    featured: false,
  },
  {
    href: '/flexbox-playground',
    icon: LayoutTemplate,
    name: 'Flexbox Playground',
    description: 'Experiment with CSS Flexbox properties interactively. Live preview with generated CSS output.',
    tags: ['css flexbox', 'layout tool'],
    featured: false,
  },
  {
    href: '/api-request-builder',
    icon: Send,
    name: 'API Request Builder',
    description: 'Build and send HTTP requests from your browser. Inspect responses and copy cURL commands.',
    tags: ['http client', 'rest tester'],
    featured: false,
  },
  {
    href: '/json-schema-generator',
    icon: ShieldCheck,
    name: 'JSON Schema Generator',
    description: 'Generate JSON Schema (draft 2020-12) from any JSON object with nested object support.',
    tags: ['json schema', 'json validation'],
    featured: false,
  },
  {
    href: '/bcrypt-generator',
    icon: ShieldCheck,
    name: 'Bcrypt Generator',
    description: 'Generate and verify bcrypt hashes locally. Adjustable salt rounds. No data transmitted.',
    tags: ['bcrypt hash', 'password hash'],
    featured: false,
  },
  {
    href: '/openapi-viewer',
    icon: BookOpen,
    name: 'OpenAPI Viewer',
    description: 'Browse OpenAPI 3.x and Swagger specs locally. Search endpoints, view parameters and responses.',
    tags: ['openapi', 'swagger viewer'],
    featured: false,
  },
  {
    href: '/tailwind-playground',
    icon: Wind,
    name: 'Tailwind Playground',
    description: 'Experiment with Tailwind CSS classes live. Desktop/mobile preview toggle and preset snippets.',
    tags: ['tailwind css', 'css playground'],
    featured: false,
  },
  {
    href: '/json-to-dart',
    icon: Cog,
    name: 'JSON → Dart Models',
    description: 'Generate Dart model classes from JSON. Supports null safety and fromJson/toJson for Flutter.',
    tags: ['dart model', 'flutter json'],
    featured: false,
  },
  {
    href: '/json-to-csharp',
    icon: Cog,
    name: 'JSON → C# Classes',
    description: 'Generate C# model classes from JSON with PascalCase, System.Text.Json attributes, and namespaces.',
    tags: ['c# model', 'csharp json'],
    featured: false,
  },
  {
    href: '/docker-compose-formatter',
    icon: Container,
    name: 'Docker Compose Formatter',
    description: 'Beautify and validate docker-compose YAML files with minify support. Browser-only, no uploads.',
    tags: ['docker compose', 'yaml formatter'],
    featured: false,
  },
]

const trustBadges = [
  { icon: Zap, label: 'Runs locally' },
  { icon: Lock, label: 'No signup' },
  { icon: Shield, label: 'Privacy-first' },
  { icon: Heart, label: 'Free forever' },
]

const whyItems = [
  {
    title: 'Your data never leaves your device',
    body: 'Every tool runs entirely in your browser using JavaScript. No file uploads, no API calls, no server processing. JWT tokens, JSON payloads, and diff content stay on your machine.',
  },
  {
    title: 'Faster than AI chat workflows',
    body: 'Open a tool, paste your content, get your result — in under a second. No prompting, no waiting for a model response, no copy-paste round trips.',
  },
  {
    title: 'Works offline after first load',
    body: 'Once the page loads, the tools work without an internet connection. Ideal for working in restricted environments, on flights, or with a spotty connection.',
  },
  {
    title: 'Built for keyboard-first developers',
    body: 'Every tool supports keyboard shortcuts, tab navigation, and accessible interactions. Designed for developers who prefer the keyboard over the mouse.',
  },
]

const faqs = [
  {
    question: 'Are all tools completely free?',
    answer:
      'Yes. Every tool in DevTools Suite is free to use with no limits, no rate limits, and no premium tier. We sustain the platform through minimal, non-intrusive advertising.',
  },
  {
    question: 'Is my data uploaded to your servers?',
    answer:
      'No. All processing happens locally in your browser. We have no backend, no database, and no server that receives your content. Your JSON, tokens, regex patterns, and checklist items never leave your device.',
  },
  {
    question: 'Do the tools work offline?',
    answer:
      'Yes. After the initial page load, all tools function without an internet connection. The only features that require connectivity are AdSense ads and Google Analytics — both of which are non-essential.',
  },
  {
    question: 'Is login or an account required?',
    answer:
      'No. There are no accounts, no sign-up forms, and no email required. Open any tool and start using it immediately.',
  },
  {
    question: 'Do the tools work on mobile?',
    answer:
      'Yes. All tools are responsive and tested at 375px viewport width. Toolbars adapt to mobile layouts, and touch interactions are supported throughout.',
  },
  {
    question: 'How is my checklist saved between sessions?',
    answer:
      "The Smart Checklist saves your work to your browser's localStorage automatically. No account needed — your list is there when you come back, as long as you use the same browser.",
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function HomePage() {
  const appLD = webApplicationLD({
    name: 'DevTools Suite',
    description:
      'Free browser-based developer tools: JSON formatter, cron generator, diff checker, JWT decoder, regex tester, smart checklist.',
    url: siteUrl,
    keywords: ['developer tools', 'online tools', 'free tools'],
  })
  const faqLD = faqPageLD(faqs)

  const [featuredTool, ...otherTools] = tools

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Background radial glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container py-14 md:py-20 text-center">
          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-5 leading-[1.1]">
            Developer Tools,{' '}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              instantly in your browser
            </span>
          </h1>

          {/* Sub */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-7 leading-relaxed">
            Privacy-first tools that run 100% locally. No login, no uploads, no tracking.
            Just open and use.
          </p>

          {/* CTAs */}
          <div className="flex flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/checklist"
              className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:bg-foreground/90 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open Smart Checklist
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-transparent px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Browse Tools
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Animated previews */}
        <div className="container pb-12 md:pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChecklistPreviewPanel />
            <CronPreviewPanel />
            <RegexPreviewPanel />
          </div>
        </div>
      </section>

      {/* ── Tool Grid ── */}
      <section id="tools" className="container py-16 md:py-10">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">All Tools</h2>
          <p className="text-muted-foreground text-sm">
            Click any tool to open it instantly. No loading screens.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Featured card — full width on its row */}
          {featuredTool && (
            <Link
              href={featuredTool.href}
              className="group relative sm:col-span-2 lg:col-span-2 rounded-xl border border-green-500/20 bg-card p-6 md:p-8 transition-all duration-300 hover:border-green-500/40 hover:-translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden"
            >
              {/* Subtle green glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 group-hover:bg-green-500/15 transition-colors">
                    <featuredTool.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-lg leading-none">{featuredTool.name}</h3>
                      <span className="inline-flex items-center rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wide">
                        Featured
                      </span>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Open <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Left: copy + tags */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/80 leading-relaxed mb-1.5 max-w-lg font-medium">
                    {featuredTool.description}
                  </p>
                  {'secondary' in featuredTool && (
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 max-w-lg">
                      {(featuredTool as typeof featuredTool & { secondary: string }).secondary}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {featuredTool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs border border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: mini nested checklist preview */}
                <div className="shrink-0 hidden sm:flex flex-col gap-1.5 rounded-lg border border-border/40 bg-muted/20 px-4 py-3 w-48 self-start" aria-hidden="true">
                  {[
                    { label: 'Backend deploy',   depth: 0, done: true },
                    { label: 'Run migrations',   depth: 1, done: true },
                    { label: 'Health checks',    depth: 1, done: true },
                    { label: 'Frontend deploy',  depth: 0, done: false },
                    { label: 'Build assets',     depth: 1, done: false },
                    { label: 'Purge CDN cache',  depth: 1, done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5" style={{ paddingLeft: item.depth * 14 }}>
                      <div className={`h-3 w-3 rounded-sm border shrink-0 flex items-center justify-center transition-colors ${item.done ? 'bg-green-500 border-green-500' : 'border-border/60 bg-transparent'}`}>
                        {item.done && (
                          <svg viewBox="0 0 10 10" className="h-2 w-2 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1.5,5 4,7.5 8.5,2" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[10px] truncate ${item.done ? 'text-muted-foreground/50 line-through' : 'text-foreground/70'}`}>{item.label}</span>
                    </div>
                  ))}
                  {/* Mini progress bar */}
                  <div className="mt-1.5 pt-1.5 border-t border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-muted-foreground/50">Progress</span>
                      <span className="text-[9px] text-muted-foreground/50">50%</span>
                    </div>
                    <div className="h-0.5 w-full rounded-full bg-border/40 overflow-hidden">
                      <div className="h-full w-1/2 rounded-full bg-green-500/70" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Regular cards */}
          {otherTools.map((tool) => {
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
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-xs border border-border/50 text-muted-foreground/70 bg-muted/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Why DevTools Suite ── */}
      <section className="border-t border-border/50">
        <AdSlot variant="banner" className="pl-5 pr-5" />
        <div className="container py-10 md:py-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Why DevTools Suite?</h2>
            <p className="text-muted-foreground">
              Built for developers who value speed, privacy, and focus over feature bloat.
            </p>
          </div>

          <div className="grid gap-px bg-border/40 rounded-xl overflow-hidden sm:grid-cols-2">
            {whyItems.map((item) => (
              <div key={item.title} className="bg-background p-6 md:p-8">
                <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border/50">
        <AdSlot variant="banner" className="pl-5 pr-5" />
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-2xl">
              <FAQSection faqs={faqs} className="pt-2" />
              <AdSlot variant="banner" className="mt-10" />
            </div>
            <aside className="hidden xl:block w-[600px] shrink-0">
              <div className="sticky top-20 flex flex-col gap-6">
                <AdSlot variant="sidebar" />
                <AdSlot variant="sidebar" />
                <AdSlot variant="sidebar" />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
