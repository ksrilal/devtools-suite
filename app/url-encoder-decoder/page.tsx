import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { URLEncoderTool } from '@/components/tools/url-encoder-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'URL Encoder / Decoder – Free Online Percent Encoding Tool',
  description:
    'Encode URLs using percent-encoding or decode encoded URL strings back to readable form. Real-time conversion, no login required, runs in your browser.',
  path: '/url-encoder-decoder',
  keywords: [
    'url encoder',
    'url decoder',
    'percent encoding',
    'url encode online',
    'url decode online',
    'encodeURIComponent',
  ],
})

const faqs = [
  {
    question: 'What is URL encoding?',
    answer:
      'URL encoding (also called percent-encoding) converts characters that are not allowed in URLs into a safe format using a "%" sign followed by two hexadecimal digits. For example, a space becomes %20 and an ampersand becomes %26.',
  },
  {
    question: 'When do I need to URL encode?',
    answer:
      'You need to encode URLs when passing query string parameters that contain special characters like spaces, &, =, +, ?, #, or non-ASCII characters like accented letters or Chinese characters.',
  },
  {
    question: 'What is the difference between encodeURI and encodeURIComponent?',
    answer:
      'encodeURI encodes a full URL and leaves characters like / : ? # & = intact. encodeURIComponent encodes a URL component (like a query value) and also encodes those characters. This tool uses encodeURIComponent, which is what you usually want for parameter values.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. All encoding and decoding is done using browser-native JavaScript functions. Nothing is sent to any server.',
  },
  {
    question: 'Can I decode multiple parameters at once?',
    answer:
      'Yes. Paste the entire encoded URL or query string and the decoder will process the whole string at once.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function URLEncoderPage() {
  const toolUrl = `${siteUrl}/url-encoder-decoder`
  const appLD = webApplicationLD({
    name: 'URL Encoder / Decoder',
    description: 'Encode or decode URL components using percent-encoding in your browser.',
    url: toolUrl,
    keywords: ['url encoder', 'url decoder', 'percent encoding'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <URLEncoderTool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">URL Encoder and Decoder</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste a URL or query string component to instantly percent-encode it, or decode an
                  already-encoded string back to readable form. The tool uses JavaScript&apos;s native
                  encodeURIComponent and decodeURIComponent functions and processes input in real-time
                  as you type. No data is sent to any server.
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
