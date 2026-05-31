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


export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container py-10 md:py-12">

        {/* Outer 3-section layout: Brand | Tools block | Resources */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center justify-center text-center shrink-0 md:w-44">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold mb-3 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="" width={22} height={22} className="rounded-sm object-cover shrink-0" />
              <span>DevTools Suite</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free browser-based tools built for developers. No login, no uploads, no tracking.
            </p>

            {/* DailyPlanly promo*/ }
            <Link href="https://dailyplanly.com" className="inline-flex items-center mt-10 font-semibold mb-3 hover:opacity-80 transition-opacity">
              <Image src="/dailyplanly.png" alt="" width={22} height={22} className="rounded-sm object-cover shrink-0" />
              <span style={{ background: 'linear-gradient(180deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Daily</span>Planly
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore your calm, printable-first productivity platform.
            </p>
          </div>

          {/* Tools block — heading above, 4 columns below */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
              {toolLinks.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="shrink-0 md:w-36">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">Resources</p>
            <nav className="flex flex-col gap-2" aria-label="Resources links">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Contact
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
