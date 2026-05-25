import type { Metadata } from 'next'
import Link from 'next/link'
import { toolMetadata } from '@/lib/seo/metadata'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'About DevTools Suite',
  description:
    'DevTools Suite is a free, privacy-first collection of browser-based developer tools. No login, no backend, no data collection.',
  path: '/about',
})

const tools = [
  { href: '/checklist',                name: 'Smart Checklist',           desc: 'Simple and Advanced modes — flat lists or 3-level nested tasks with progress tracking, drag-and-drop, PDF/Markdown/JSON/CSV export, and shareable URLs.' },
  { href: '/json-formatter',           name: 'JSON Formatter',            desc: 'Prettify, minify, validate and explore JSON with syntax highlighting.' },
  { href: '/cron-generator',           name: 'Cron Generator',            desc: 'Build and validate cron expressions visually with next-execution previews.' },
  { href: '/diff-checker',             name: 'Diff Checker',              desc: 'Compare two texts side by side with line, character, and JSON diff modes.' },
  { href: '/jwt-decoder',              name: 'JWT Decoder',               desc: 'Decode JWT tokens and inspect header, payload, and expiry claims.' },
  { href: '/regex-tester',             name: 'Regex Tester',              desc: 'Test regular expressions live with match highlighting and replace preview.' },
  { href: '/base64-encoder-decoder',   name: 'Base64 Encoder / Decoder',  desc: 'Encode and decode Base64 strings and files entirely in the browser.' },
  { href: '/uuid-generator',           name: 'UUID Generator',            desc: 'Generate cryptographically random UUID v4 values in bulk with copy support.' },
  { href: '/url-encoder-decoder',      name: 'URL Encoder / Decoder',     desc: 'Percent-encode URLs or decode encoded URL strings in real time.' },
  { href: '/markdown-previewer',       name: 'Markdown Previewer',        desc: 'Write Markdown with a live GitHub-style preview. Sanitized and real-time.' },
  { href: '/sql-formatter',            name: 'SQL Formatter',             desc: 'Beautify or minify SQL queries with dialect-aware formatting.' },
  { href: '/color-converter',          name: 'Color Converter',           desc: 'Convert colors between HEX, RGB, HSL, and HSV with a live color picker.' },
  { href: '/hash-generator',           name: 'Hash Generator',            desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using browser-native Web Crypto.' },
  { href: '/yaml-json-converter',      name: 'YAML ↔ JSON Converter',     desc: 'Convert between YAML and JSON with validation and pretty-printing.' },
  { href: '/json-ts-generator',        name: 'JSON → TypeScript',         desc: 'Generate typed TypeScript interfaces from JSON with nested object support.' },
  { href: '/csv-json-converter',       name: 'CSV ↔ JSON Converter',      desc: 'Convert CSV to JSON or JSON arrays to CSV. Upload files or paste directly.' },
  { href: '/timestamp-converter',      name: 'Timestamp Converter',       desc: 'Convert Unix timestamps to human-readable dates and vice versa across timezones.' },
  { href: '/case-converter',           name: 'Case Converter',            desc: 'Convert text between camelCase, snake_case, PascalCase, kebab-case, and more.' },
  { href: '/password-generator',       name: 'Password Generator',        desc: 'Generate cryptographically secure passwords with configurable length and character sets.' },
  { href: '/jwt-generator',            name: 'JWT Generator',             desc: 'Sign and build JWT tokens with custom headers, payloads, and HS256/HS384/HS512 algorithms.' },
  { href: '/xml-formatter',            name: 'XML Formatter',             desc: 'Pretty-print or minify XML with validation and error line numbers.' },
  { href: '/qr-code-generator',        name: 'QR Code Generator',         desc: 'Generate QR codes from any text or URL. Download as PNG with adjustable size.' },
  { href: '/json-zod-generator',       name: 'JSON → Zod Schema',         desc: 'Generate typed Zod schemas from JSON with strict mode and inferred TypeScript types.' },
  { href: '/flexbox-playground',       name: 'Flexbox Playground',        desc: 'Visually configure CSS Flexbox properties and copy the generated CSS output.' },
  { href: '/api-request-builder',      name: 'API Request Builder',       desc: 'Build and send HTTP requests from your browser. Inspect responses and import cURL commands.' },
  { href: '/json-schema-generator',    name: 'JSON Schema Generator',     desc: 'Generate JSON Schema draft 2020-12 from any JSON object with nested support.' },
  { href: '/bcrypt-generator',         name: 'Bcrypt Generator',          desc: 'Hash and verify passwords with bcrypt entirely in the browser. Adjustable salt rounds.' },
  { href: '/openapi-viewer',           name: 'OpenAPI Viewer',            desc: 'Paste or upload an OpenAPI 3.x spec and browse endpoints, parameters, and responses.' },
  { href: '/tailwind-playground',      name: 'Tailwind Playground',       desc: 'Write HTML with Tailwind classes and preview the result live with desktop/mobile toggle.' },
  { href: '/json-to-dart',             name: 'JSON → Dart Models',        desc: 'Generate Dart model classes from JSON with null safety and fromJson/toJson support.' },
  { href: '/json-to-csharp',           name: 'JSON → C# Classes',         desc: 'Generate C# classes from JSON with PascalCase, nullable types, and namespace support.' },
  { href: '/docker-compose-formatter', name: 'Docker Compose Formatter',  desc: 'Beautify or minify docker-compose YAML with human-friendly validation errors.' },
]

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="flex gap-8">

        {/* Left: content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">About DevTools Suite</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Free, private, browser-based tools for developers and technical users.
          </p>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <p>
              DevTools Suite is a free collection of developer productivity tools that run entirely
              in your browser. No login required. No data sent to servers. No tracking of your
              content. Open a tool, use it, close it — your data stays on your device.
            </p>
          </div>

          <AdSlot variant="banner" className="mb-8" />

          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Our philosophy</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Privacy first', body: 'All processing happens locally in your browser. Your code, tokens, JSON, and checklist data never leave your device.' },
                { label: 'Zero friction', body: 'Open a tool and start using it immediately. No accounts, no onboarding, no paywalls, no cookie popups.' },
                { label: 'Fast', body: 'Lightweight static pages with minimal JavaScript. Optimized for instant load times and smooth interactions.' },
                { label: 'Accessible', body: 'Keyboard navigation, screen reader support, and first-class dark and light mode across all tools.' },
              ].map(({ label, body }) => (
                <div key={label} className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm font-semibold mb-1">{label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <AdSlot variant="banner" className="mb-8" />

          <div>
            <h2 className="text-xl font-bold tracking-tight mb-4">Tools available</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tools.map(({ href, name, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg border border-border/50 p-4 hover:border-border hover:bg-muted/30 transition-colors group"
                >
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors mb-1">{name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sidebar ads */}
        <aside className="hidden xl:block w-[300px] 2xl:w-[600px] shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <AdSlot variant="sidebar-wide" />
            <AdSlot variant="sidebar" />
            <AdSlot variant="sidebar" />
            <AdSlot variant="sidebar" />
            <AdSlot variant="sidebar" />
            <AdSlot variant="sidebar" />
          </div>
        </aside>

      </div>
    </div>
  )
}
