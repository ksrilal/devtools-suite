import Link from 'next/link'
import Image from 'next/image'

const toolLinks = [
  { href: '/checklist', label: 'Checklist' },
  { href: '/json-formatter', label: 'JSON Formatter' },
  { href: '/cron-generator', label: 'Cron Generator' },
  { href: '/diff-checker', label: 'Diff Checker' },
  { href: '/jwt-decoder', label: 'JWT Decoder' },
  { href: '/regex-tester', label: 'Regex Tester' },
  { href: '/base64-encoder-decoder', label: 'Base64 Encoder' },
  { href: '/uuid-generator', label: 'UUID Generator' },
  { href: '/url-encoder-decoder', label: 'URL Encoder' },
  { href: '/markdown-previewer', label: 'Markdown Previewer' },
  { href: '/sql-formatter', label: 'SQL Formatter' },
  { href: '/color-converter', label: 'Color Converter' },
  { href: '/hash-generator', label: 'Hash Generator' },
  { href: '/yaml-json-converter', label: 'YAML ↔ JSON' },
  { href: '/json-ts-generator',   label: 'JSON → TypeScript' },
  { href: '/csv-json-converter',  label: 'CSV ↔ JSON' },
  { href: '/timestamp-converter', label: 'Timestamp Converter' },
  { href: '/case-converter',      label: 'Case Converter' },
  { href: '/password-generator',  label: 'Password Generator' },
  { href: '/jwt-generator',       label: 'JWT Generator' },
  { href: '/xml-formatter',       label: 'XML Formatter' },
  { href: '/qr-code-generator',   label: 'QR Code Generator' },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold mb-3 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="" width={22} height={22} className="rounded-sm object-cover shrink-0" />
              <span>DevTools Suite</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Free browser-based tools built for developers. No login, no uploads, no tracking.
            </p>
          </div>

          {/* Tools — first half */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Tools</p>
            <nav className="flex flex-col gap-2" aria-label="Tool links (first)">
              {toolLinks.slice(0, 12).map((t) => (
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

          {/* Tools — second half */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3 invisible">Tools</p>
            <nav className="flex flex-col gap-2" aria-label="Tool links (second)">
              {toolLinks.slice(12).map((t) => (
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

          {/* Legal */}
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
