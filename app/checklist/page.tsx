import type { Metadata } from 'next'
import { ShieldCheck, Zap, Share2, FileDown, Layers } from 'lucide-react'
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
    question: 'What is the difference between Simple and Advanced mode?',
    answer:
      'Simple mode converts any flat list into a checklist instantly — great for quick task lists. Advanced mode supports up to 3 levels of nesting (parent → child → sub-task), with collapse/expand, per-parent progress tracking, and drag-and-drop reordering within each level.',
  },
  {
    question: 'How does the smart checklist tool work?',
    answer:
      'Paste any text and the tool converts it into an interactive checklist. In Simple mode it splits by newlines, commas, or tabs. In Advanced mode, indent with 2 spaces per level to create nested items. Check off items, mark them invalid, reorder with drag-and-drop, and export when done.',
  },
  {
    question: 'How do I create nested tasks in Advanced mode?',
    answer:
      'Paste indented text using 2 spaces per level (e.g. "  child task" under a parent), or start with a blank list and use the indent button (→) to move items deeper. You can nest up to 3 levels: parent, child, and sub-task. Use the outdent button (←) to promote items back up.',
  },
  {
    question: 'Is my checklist data saved?',
    answer:
      'Yes — both Simple and Advanced checklists are automatically saved in your browser\'s localStorage, including your last selected mode. No data is sent to any server. Everything stays on your device.',
  },
  {
    question: 'Can I share my checklist with others?',
    answer:
      'Yes. The Share button generates a URL that encodes your entire checklist (and the active mode) so anyone opening the link sees the same list in the same mode — no account or backend needed.',
  },
  {
    question: 'Can I export my checklist as a PDF?',
    answer:
      'Yes. Both Simple and Advanced modes support PDF export. The Advanced PDF preserves the hierarchy with indentation per nesting level and colour-coded checkboxes (green = done, red = invalid).',
  },
  {
    question: 'What export formats are available?',
    answer:
      'Simple mode: PDF, Markdown, Plain Text, CSV. Advanced mode: PDF, Markdown, Plain Text, JSON (full tree structure), CSV.',
  },
  {
    question: 'What input formats are supported in Simple mode?',
    answer:
      'Newlines, commas, and tabs as separators. Auto-detects existing checkbox markers like [ ], [x], ✓, and ✗ — no reformatting needed.',
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

          {/* About — full width */}
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-tight mb-2">
              Built for developers.{' '}
              <span className="text-muted-foreground font-normal">Useful for everyone.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-2xl">
              Two modes, one tool. Simple mode turns any flat list into an interactive checklist in seconds.
              Advanced mode gives you a full 3-level hierarchy — parents, children, and sub-tasks — with
              progress tracking, collapse/expand, and nested drag-and-drop.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/60 mb-8">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" aria-hidden="true" />
              Runs entirely in your browser. No uploads. No login. No tracking.
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[
                { icon: Zap,      label: 'Smart parsing',   body: 'Simple mode: paste anything — newlines, commas, tabs, or existing markers like [ ], [x], ✓, ✗. Advanced mode: paste indented text (2 spaces per level) to create nested tasks instantly.' },
                { icon: Layers,   label: 'Nested hierarchy', body: 'Advanced mode supports 3 levels deep. Indent/outdent items with one click. Parent state syncs automatically from children.' },
                { icon: Share2,   label: 'Shareable URLs',  body: 'Encodes your checklist and active mode into a URL. Anyone opening the link sees the same list, same view.' },
                { icon: FileDown, label: 'Export anywhere',  body: 'PDF, Markdown, JSON, CSV, or plain text. Advanced PDF preserves indentation and colour-coded states.' },
              ].map(({ icon: Icon, label, body }) => (
                <div key={label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50">
                    <Icon className="h-4 w-4 text-muted-foreground/70" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold">{label}</p>
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

          {/* Banner ad */}
          <AdSlot variant="banner" className="mb-10" />

          {/* FAQ + sidebar ad */}
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <FAQSection faqs={faqs} />
            </div>
            <aside className="hidden xl:block w-[300px] shrink-0">
              <div className="sticky top-20 flex flex-col gap-6">
                <AdSlot variant="sidebar-wide" />
                <AdSlot variant="sidebar" />
              </div>
            </aside>
          </div>

        </div>
      </section>
    </>
  )
}
