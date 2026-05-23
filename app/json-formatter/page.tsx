import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JSONFormatterTool } from '@/components/tools/json-formatter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JSON Formatter & Validator – Free Online JSON Beautifier',
  description:
    'Free online JSON formatter, validator and beautifier. Prettify, minify, validate and explore JSON with syntax highlighting. No login required, runs in your browser.',
  path: '/json-formatter',
  keywords: [
    'json formatter online',
    'json validator',
    'json beautifier',
    'json pretty print',
    'json minifier',
    'format json',
  ],
})

const faqs = [
  {
    question: 'What is a JSON formatter?',
    answer:
      'A JSON formatter takes raw or minified JSON and outputs it with proper indentation and line breaks, making it easy to read and understand the structure.',
  },
  {
    question: 'Is my JSON data safe?',
    answer:
      'Completely. All JSON processing happens in your browser using JavaScript. Your data is never sent to any server.',
  },
  {
    question: 'Can it handle large JSON files?',
    answer:
      'Yes, the formatter uses efficient parsing and a custom tokeniser to handle large JSON without blocking the browser.',
  },
  {
    question: 'What is JSON validation?',
    answer:
      'JSON validation checks that your text is valid JSON syntax. The tool shows the exact line and column of any syntax error.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function JSONFormatterPage() {
  const toolUrl = `${siteUrl}/json-formatter`
  const appLD = webApplicationLD({
    name: 'JSON Formatter & Validator',
    description: 'Format, validate and beautify JSON with syntax highlighting.',
    url: toolUrl,
    keywords: ['json formatter', 'json validator', 'json beautifier'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      {/* Tool — full width, no ad interference */}
      <JSONFormatterTool />

      {/* About + FAQ + Ads — merged single section */}
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">

            {/* Left: about + banner + FAQ */}
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JSON Formatter and Validator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any JSON string and instantly prettify it with configurable indentation, minify
                  it to a single line, or validate the syntax with precise error reporting. The built-in
                  syntax highlighter uses a lightweight custom tokeniser (not Prism.js) for fast
                  rendering even with large JSON objects.
                </p>
              </div>
              <AdSlot variant="banner" className="mb-8" />
              <FAQSection faqs={faqs} className="border-t pt-8" />
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
