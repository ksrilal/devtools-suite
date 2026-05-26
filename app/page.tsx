import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, Lock, Heart } from 'lucide-react'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { ChecklistPreviewPanel } from '@/components/home/checklist-preview'
import { CronPreviewPanel } from '@/components/home/cron-preview'
import { RegexPreviewPanel } from '@/components/home/regex-preview'
import { ToolsGrid } from '@/components/home/tools-grid'
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
        <ToolsGrid />
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
