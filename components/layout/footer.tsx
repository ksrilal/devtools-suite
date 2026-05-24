import Link from 'next/link'
import Image from 'next/image'

const toolLinks = [
  { href: '/checklist',            label: 'Checklist' },
  { href: '/json-formatter',       label: 'JSON Formatter' },
  { href: '/cron-generator',       label: 'Cron Generator' },
  { href: '/diff-checker',         label: 'Diff Checker' },
  { href: '/jwt-decoder',          label: 'JWT Decoder' },
  { href: '/regex-tester',         label: 'Regex Tester' },
  { href: '/base64-encoder-decoder', label: 'Base64 Encoder' },
  { href: '/uuid-generator',       label: 'UUID Generator' },
  { href: '/url-encoder-decoder',  label: 'URL Encoder' },
  { href: '/markdown-previewer',   label: 'Markdown Previewer' },
  { href: '/sql-formatter',        label: 'SQL Formatter' },
  { href: '/color-converter',      label: 'Color Converter' },
  { href: '/hash-generator',       label: 'Hash Generator' },
  { href: '/yaml-json-converter',  label: 'YAML ↔ JSON' },
  { href: '/json-ts-generator',    label: 'JSON → TypeScript' },
  { href: '/csv-json-converter',   label: 'CSV ↔ JSON' },
  { href: '/timestamp-converter',  label: 'Timestamp Converter' },
  { href: '/case-converter',       label: 'Case Converter' },
  { href: '/password-generator',   label: 'Password Generator' },
  { href: '/jwt-generator',        label: 'JWT Generator' },
  { href: '/xml-formatter',        label: 'XML Formatter' },
  { href: '/qr-code-generator',    label: 'QR Code Generator' },
  { href: '/json-zod-generator',   label: 'JSON → Zod Schema' },
  { href: '/flexbox-playground',   label: 'Flexbox Playground' },
  { href: '/api-request-builder',  label: 'API Request Builder' },
  { href: '/json-schema-generator',label: 'JSON Schema Generator' },
  { href: '/bcrypt-generator',     label: 'Bcrypt Generator' },
  { href: '/openapi-viewer',       label: 'OpenAPI Viewer' },
  { href: '/tailwind-playground',  label: 'Tailwind Playground' },
  { href: '/json-to-dart',         label: 'JSON → Dart' },
  { href: '/json-to-csharp',       label: 'JSON → C#' },
  { href: '/docker-compose-formatter', label: 'Docker Compose Formatter' },
]

const COL1 = Math.ceil(toolLinks.length / 4)
const COL2 = COL1
const COL3 = COL1

function ToolColumn({ links, showHeading }: { links: typeof toolLinks; showHeading: boolean }) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3 ${showHeading ? '' : 'invisible'}`}>
        Tools
      </p>
      <nav className="flex flex-col gap-2">
        {links.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container py-10 md:py-12">
        {/* Brand + 4 tool columns + Company */}
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {/* Brand — full width on mobile, 1 col md+ */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold mb-3 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="" width={22} height={22} className="rounded-sm object-cover shrink-0" />
              <span>DevTools Suite</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Free browser-based tools built for developers. No login, no uploads, no tracking.
            </p>
            <a
              href="https://github.com/ksrilal/devtools-suite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              ksrilal/devtools-suite
            </a>
          </div>

          <ToolColumn links={toolLinks.slice(0, COL1)} showHeading={true} />
          <ToolColumn links={toolLinks.slice(COL1, COL1 + COL2)} showHeading={false} />
          <ToolColumn links={toolLinks.slice(COL1 + COL2, COL1 + COL2 + COL3)} showHeading={false} />
          <ToolColumn links={toolLinks.slice(COL1 + COL2 + COL3)} showHeading={false} />

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Company</p>
            <nav className="flex flex-col gap-2" aria-label="Company links">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60">
          <p>© {new Date().getFullYear()} DevTools Suite. All tools run locally in your browser.</p>
          <p>Built for developers who value speed and privacy.</p>
        </div>
      </div>
    </footer>
  )
}
