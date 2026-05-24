import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { TimestampConverterTool } from '@/components/tools/timestamp-converter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Unix Timestamp Converter – Epoch to Date & Date to Timestamp',
  description:
    'Convert Unix timestamps to human-readable dates or convert dates to Unix epoch time. Supports seconds and milliseconds, local timezone and UTC. Free, browser-based.',
  path: '/timestamp-converter',
  keywords: [
    'unix timestamp converter',
    'epoch to date',
    'date to unix timestamp',
    'timestamp converter online',
    'epoch time converter',
    'unix time converter',
  ],
})

const faqs = [
  {
    question: 'What is a Unix timestamp?',
    answer: 'A Unix timestamp (also called epoch time) is the number of seconds that have elapsed since January 1, 1970 at 00:00:00 UTC. It is widely used in programming to represent points in time in a compact, timezone-independent format.',
  },
  {
    question: 'What is the difference between seconds and milliseconds timestamps?',
    answer: 'Most Unix APIs return timestamps in seconds (10 digits for current time). JavaScript\'s Date.now() returns milliseconds (13 digits). Use the toggle to select which unit your input uses.',
  },
  {
    question: 'What timezone does the converter use?',
    answer: 'The tool shows both UTC (timezone-independent) and Local time (your browser\'s timezone). The ISO 8601 output always includes the UTC offset.',
  },
  {
    question: 'Can I enter a date in any format?',
    answer: 'The text input accepts any string parseable by JavaScript\'s Date constructor, including ISO 8601 (2024-01-15T12:00:00Z), US format (Jan 15 2024), and many others. Use the date picker for reliable input.',
  },
  {
    question: 'Is any data sent to a server?',
    answer: 'No. All conversions use JavaScript\'s built-in Date APIs and run entirely in your browser.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function TimestampConverterPage() {
  const toolUrl = `${siteUrl}/timestamp-converter`
  const appLD = webApplicationLD({
    name: 'Unix Timestamp Converter',
    description: 'Convert Unix timestamps to dates and dates to Unix epoch time.',
    url: toolUrl,
    keywords: ['unix timestamp converter', 'epoch to date', 'timestamp converter online'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <TimestampConverterTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Unix Timestamp and Epoch Converter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Convert a Unix timestamp (in seconds or milliseconds) to a human-readable date in UTC, local time, and ISO 8601 format. Or enter any date string to get the corresponding Unix epoch values. Click Now to use the current time. All conversions happen instantly in your browser using native Date APIs.
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
