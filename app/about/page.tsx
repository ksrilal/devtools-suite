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
  { href: '/checklist', name: 'Smart Checklist', desc: 'Convert any list to an interactive checklist with drag-and-drop, PDF export, and shareable URLs.' },
  { href: '/json-formatter', name: 'JSON Formatter', desc: 'Prettify, minify, validate and explore JSON with syntax highlighting.' },
  { href: '/cron-generator', name: 'Cron Generator', desc: 'Build and validate cron expressions visually with next-execution previews.' },
  { href: '/diff-checker', name: 'Diff Checker', desc: 'Compare two texts side by side with line, character, and JSON diff modes.' },
  { href: '/jwt-decoder', name: 'JWT Decoder', desc: 'Decode JWT tokens and inspect header, payload, and expiry claims.' },
  { href: '/regex-tester', name: 'Regex Tester', desc: 'Test regular expressions live with match highlighting and replace preview.' },
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
          </div>
        </aside>

      </div>
    </div>
  )
}
