import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { DiffCheckerTool } from '@/components/tools/diff-checker-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Diff Checker – Compare Text Online Free',
  description:
    'Free online diff checker. Compare text side by side with line diff, character diff, and JSON-aware comparison. File upload supported. Runs entirely in your browser.',
  path: '/diff-checker',
  keywords: [
    'diff checker',
    'compare text online',
    'text diff',
    'json diff tool',
    'side by side diff',
    'file diff checker',
  ],
})

const faqs = [
  {
    question: 'How does the diff checker work?',
    answer:
      'Paste text in both panels and choose the comparison mode. Line diff shows added/removed lines, character diff highlights individual character changes, and JSON diff normalizes both inputs before comparing.',
  },
  {
    question: 'Can I compare files?',
    answer: 'Yes, click the file upload button in either panel to load a text file directly.',
  },
  {
    question: 'Is JSON diff smart?',
    answer:
      'Yes, the JSON diff mode parses both inputs and formats them consistently before comparing, so whitespace differences don\'t appear as changes.',
  },
  {
    question: 'Are my files sent to a server?',
    answer:
      'No. All comparison happens locally in your browser. Files and text never leave your device.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function DiffCheckerPage() {
  const toolUrl = `${siteUrl}/diff-checker`
  const appLD = webApplicationLD({
    name: 'Diff Checker',
    description: 'Compare two texts side by side with line, character, and JSON diff modes.',
    url: toolUrl,
    keywords: ['diff checker', 'compare text', 'text diff', 'json diff'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <DiffCheckerTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Online Diff Checker and Text Comparison Tool</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compare two text blocks or files side by side and instantly see what changed. Choose
                  from three comparison modes: line diff for a high-level view, character diff for
                  precise changes, and JSON diff for structure-aware comparison that ignores formatting
                  differences.
                </p>
              </div>
              <AdSlot variant="banner" className="mb-8" />
              <FAQSection faqs={faqs} className="border-t pt-8" />
              <AdSlot variant="banner" className="mt-8" />
            </div>
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
