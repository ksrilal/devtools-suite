import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { XMLFormatterTool } from '@/components/tools/xml-formatter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'XML Formatter – Free Online XML Beautifier & Minifier',
  description:
    'Format and beautify XML with proper indentation, or minify XML to a single line. Validates XML structure and reports errors. Free, browser-based, no login.',
  path: '/xml-formatter',
  keywords: [
    'xml formatter',
    'xml beautifier',
    'format xml online',
    'xml minifier',
    'xml pretty print',
    'xml validator',
  ],
})

const faqs = [
  {
    question: 'Does the formatter validate XML?',
    answer: 'Yes. The tool validates the XML structure before formatting and shows a descriptive error message with the line number if the XML is malformed.',
  },
  {
    question: 'Does it preserve attributes and CDATA sections?',
    answer: 'Yes. Attributes are preserved with their values and CDATA sections are maintained in the output.',
  },
  {
    question: 'Is my XML data safe?',
    answer: 'Yes. All formatting and validation is done using the fast-xml-parser library running in your browser. No XML is sent to any server.',
  },
  {
    question: 'What does minify do?',
    answer: 'Minify removes all extra whitespace between tags, producing a compact single-line XML string. Useful for reducing payload size in APIs or config files.',
  },
  {
    question: 'Can it handle large XML files?',
    answer: 'The tool handles typical XML files well. Very large XML files (several MB) may be slower due to browser memory limits, but most developer use cases work fine.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function XMLFormatterPage() {
  const toolUrl = `${siteUrl}/xml-formatter`
  const appLD = webApplicationLD({
    name: 'XML Formatter',
    description: 'Format and validate XML with proper indentation or minify to a single line.',
    url: toolUrl,
    keywords: ['xml formatter', 'xml beautifier', 'format xml online'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <XMLFormatterTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">XML Formatter and Validator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste XML and click Format to get a cleanly indented, readable document. Click Minify to collapse it to a single line. The validator uses fast-xml-parser to catch malformed XML before formatting and reports the exact line of any error. Download the result as a <code className="text-xs font-mono bg-muted px-1 rounded">.xml</code> file. All processing happens in your browser.
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
