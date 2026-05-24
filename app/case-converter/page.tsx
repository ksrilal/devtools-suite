import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { CaseConverterTool } from '@/components/tools/case-converter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Case Converter – camelCase, snake_case, PascalCase & More',
  description:
    'Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and more. Real-time conversion with copy buttons. Free, browser-based.',
  path: '/case-converter',
  keywords: [
    'case converter',
    'camelcase converter',
    'snake case converter',
    'kebab case converter',
    'pascal case converter',
    'string case converter online',
  ],
})

const faqs = [
  {
    question: 'What case formats are supported?',
    answer: 'The tool converts to: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, lowercase, UPPERCASE, Title Case, and Sentence case — all at once.',
  },
  {
    question: 'How does the converter detect word boundaries?',
    answer: 'It splits on spaces, hyphens, underscores, and transitions between lowercase and uppercase letters (for camelCase/PascalCase inputs). This means any input format is correctly tokenized.',
  },
  {
    question: 'Does it support multi-line input?',
    answer: 'Yes. Each line is converted independently, preserving your line breaks in the output.',
  },
  {
    question: 'Is any data sent to a server?',
    answer: 'No. All conversion is performed with pure JavaScript running in your browser. Nothing is transmitted anywhere.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function CaseConverterPage() {
  const toolUrl = `${siteUrl}/case-converter`
  const appLD = webApplicationLD({
    name: 'Case Converter',
    description: 'Convert text between camelCase, snake_case, PascalCase, kebab-case, and more.',
    url: toolUrl,
    keywords: ['case converter', 'camelcase converter', 'snake case converter'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <CaseConverterTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Text Case Converter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type or paste text and see all common case formats side by side in real time. Click the copy icon on any card to copy that variant to your clipboard. Useful for renaming variables, formatting identifiers, or transforming user-facing labels. All processing is in your browser.
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
