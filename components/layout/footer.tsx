import Link from 'next/link'
import Image from 'next/image'

const toolLinks = [
  { href: '/checklist', label: 'Checklist' },
  { href: '/json-formatter', label: 'JSON Formatter' },
  { href: '/cron-generator', label: 'Cron Generator' },
  { href: '/diff-checker', label: 'Diff Checker' },
  { href: '/jwt-decoder', label: 'JWT Decoder' },
  { href: '/regex-tester', label: 'Regex Tester' },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold mb-3 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="DevTools Suite" width={20} height={20} className="rounded-sm" />
              <span>DevTools Suite</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Free browser-based tools built for developers. No login, no uploads, no tracking.
            </p>
          </div>

          {/* Tools */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Tools</p>
            <nav className="flex flex-col gap-2" aria-label="Tool links">
              {toolLinks.map((t) => (
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
