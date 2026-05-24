import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { Base64Tool } from '@/components/tools/base64-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Base64 Encoder / Decoder – Free Online Base64 Tool',
  description:
    'Encode text to Base64 or decode Base64 strings back to plain text instantly. Free, private, runs entirely in your browser. No login required.',
  path: '/base64-encoder-decoder',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'online base64 tool',
    'encode base64',
    'decode base64',
    'base64 converter',
  ],
})

const faqs = [
  {
    question: 'What is Base64 encoding?',
    answer:
      'Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters. It is commonly used to transmit binary data over text-based protocols like HTTP and email.',
  },
  {
    question: 'Is my data safe when using this tool?',
    answer:
      'Yes. All encoding and decoding happens entirely in your browser using JavaScript. No data is ever sent to a server.',
  },
  {
    question: 'Why does my Base64 string end with == or =?',
    answer:
      'Base64 encodes data in 3-byte blocks. If the input is not divisible by 3, padding characters (=) are added to make the output a multiple of 4 characters.',
  },
  {
    question: 'Can Base64 handle Unicode or emoji?',
    answer:
      'Yes. This tool first UTF-8 encodes the input before Base64 encoding, so it correctly handles any Unicode character including emoji.',
  },
  {
    question: 'What is the difference between Base64 and encryption?',
    answer:
      'Base64 is encoding, not encryption. Anyone with a Base64 decoder can read the original content. Do not use Base64 to protect sensitive data — use proper encryption for that.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function Base64Page() {
  const toolUrl = `${siteUrl}/base64-encoder-decoder`
  const appLD = webApplicationLD({
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text.',
    url: toolUrl,
    keywords: ['base64 encoder', 'base64 decoder', 'online base64 tool'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <Base64Tool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Base64 Encoder and Decoder</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any plain text and instantly encode it to Base64, or paste a Base64 string
                  to decode it back to readable text. The tool handles full Unicode including emoji
                  by UTF-8 encoding before conversion. No data leaves your browser.
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
