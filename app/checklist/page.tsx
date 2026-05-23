import type { Metadata } from 'next'
import { ShieldCheck, Zap, Share2, FileDown } from 'lucide-react'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { ChecklistTool } from '@/components/tools/checklist-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Smart Checklist Tool – Free Online Checklist Maker',
  description:
    'Free online checklist tool. Paste any text to create an interactive checklist with drag-and-drop, progress tracking, PDF export and shareable URLs. No login required.',
  path: '/checklist',
  keywords: [
    'online checklist tool',
    'checklist maker',
    'developer checklist',
    'release checklist',
    'QA checklist tool',
    'printable checklist',
  ],
})

const faqs = [
  {
    question: 'How does the smart checklist tool work?',
    answer:
      'Paste any text — newline-separated, comma-separated, or mixed — and the tool instantly converts it into an interactive checklist. Check items off, mark them as invalid, reorder with drag-and-drop, and export when done.',
  },
  {
    question: 'Is my checklist data saved?',
    answer:
      'Your checklist is automatically saved in your browser\'s localStorage. No data is sent to any server. Everything stays on your device.',
  },
  {
    question: 'Can I share my checklist with others?',
    answer:
      'Yes! Use the Share button to generate a URL that encodes your entire checklist. Anyone with the link can open it in their browser.',
  },
  {
    question: 'Can I export my checklist as a PDF?',
    answer:
      'Yes, click the Export PDF button to download a clean, print-friendly PDF of your checklist with all item states preserved.',
  },
  {
    question: 'What input formats are supported?',
    answer:
      'The tool accepts newlines, commas, and tabs as separators. It also auto-detects existing checkbox markers like [ ], [x], ✓, and ✗.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function ChecklistPage() {
  const toolUrl = `${siteUrl}/checklist`
  const appLD = webApplicationLD({
    name: 'Smart Checklist Tool',
    description: 'Convert any text into an interactive checklist with progress tracking, drag-and-drop, and PDF export.',
    url: toolUrl,
    keywords: ['checklist', 'online checklist', 'release checklist', 'qa checklist'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <ChecklistTool />

      {/* ── About + FAQ + Ads ── */}
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">

            {/* Left: about + banner + FAQ stacked */}
            <div className="flex-1 min-w-0 max-w-3xl">

              {/* About */}
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">
                  Built for developers.{' '}
                  <span className="text-muted-foreground font-normal">Useful for everyone.</span>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-xl">
                  Turn any list into an interactive checklist instantly — from release workflows and QA
                  steps to sprint tasks, study plans, and packing lists. Paste once, check off as you go.
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/60 mb-6">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" aria-hidden="true" />
                  Runs entirely in your browser. No uploads. No login. No tracking.
                </div>
                <div className="grid gap-6 sm:grid-cols-3 mb-6">
                  {[
                    { icon: Zap,      label: 'Smart parsing',   body: 'Auto-detects newlines, commas, tabs, and existing markers like [ ], [x], ✓, and ✗. No formatting needed.' },
                    { icon: Share2,   label: 'Shareable URLs',  body: 'Your entire checklist encodes into a URL. Share with your team instantly — no account, no backend.' },
                    { icon: FileDown, label: 'Export anywhere', body: 'Download as PDF, Markdown, CSV, or plain text. Print-ready in one click.' },
                  ].map(({ icon: Icon, label, body }) => (
                    <div key={label}>
                      <Icon className="h-4 w-4 text-muted-foreground/50 mb-2" aria-hidden="true" />
                      <p className="text-sm font-semibold mb-1">{label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/40">
                  {'Perfect for '}
                  {['release checklists', 'QA runs', 'deployment tasks', 'sprint planning', 'study plans', 'packing lists'].map((item, i, arr) => (
                    <span key={item}>
                      <span className="text-muted-foreground/60">{item}</span>
                      {i < arr.length - 1 && <span className="mx-1.5">·</span>}
                    </span>
                  ))}
                </p>
              </div>

              {/* Banner ad between about and FAQ */}
              <AdSlot variant="banner" className="mb-4" />

              {/* FAQ */}
              <FAQSection faqs={faqs} className="border-t pt-8" />

              {/* Banner ad between about and FAQ */}
              <AdSlot variant="banner" className="mt-8" />

            </div>

            {/* Right: stacked sidebar ads */}
            <aside className="hidden xl:block w-[300px] 2xl:w-[600px] shrink-0">
              <div className="sticky top-20 flex flex-col gap-6">
                <AdSlot variant="sidebar-wide" />
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
