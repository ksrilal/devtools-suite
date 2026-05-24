import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { CSVJSONConverterTool } from '@/components/tools/csv-json-converter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'CSV to JSON Converter – Free Online CSV ↔ JSON Tool',
  description:
    'Convert CSV to JSON or JSON arrays to CSV instantly. Upload .csv files or paste directly. Handles headers, types, and pretty-formatting. Free, browser-based.',
  path: '/csv-json-converter',
  keywords: [
    'csv to json',
    'json to csv',
    'csv json converter',
    'convert csv online',
    'csv parser online',
    'json to csv converter',
  ],
})

const faqs = [
  {
    question: 'Does it handle CSV headers automatically?',
    answer: 'Yes. The first row of the CSV is used as property names in the resulting JSON objects.',
  },
  {
    question: 'Can I upload a .csv file?',
    answer: 'Yes. Use the Upload button in the toolbar to select a .csv or .txt file. The content is read locally in your browser — it is not uploaded to any server.',
  },
  {
    question: 'What JSON structure is required for JSON to CSV conversion?',
    answer: 'The input must be a JSON array of objects. Each object becomes a row and the keys of the first object become the CSV headers.',
  },
  {
    question: 'Are number and boolean types preserved?',
    answer: 'When converting CSV to JSON, the parser automatically detects numbers and booleans using dynamic typing. When converting JSON to CSV, values are serialised as-is.',
  },
  {
    question: 'Is my data safe?',
    answer: 'Yes. All conversion is performed in your browser using the PapaParse library. No data is sent to any server.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function CSVJSONConverterPage() {
  const toolUrl = `${siteUrl}/csv-json-converter`
  const appLD = webApplicationLD({
    name: 'CSV ↔ JSON Converter',
    description: 'Convert CSV to JSON or JSON arrays to CSV in your browser.',
    url: toolUrl,
    keywords: ['csv to json', 'json to csv', 'csv json converter'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <CSVJSONConverterTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">CSV to JSON Converter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste CSV text or upload a .csv file to convert it to a pretty-printed JSON array. Switch directions to convert a JSON array back to CSV for spreadsheet compatibility. Headers are handled automatically. Powered by PapaParse running entirely in your browser.
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
