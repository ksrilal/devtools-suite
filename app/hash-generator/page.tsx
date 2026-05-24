import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { HashGeneratorTool } from '@/components/tools/hash-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Hash Generator – SHA-256, SHA-512, SHA-1, MD5 Online Tool',
  description:
    'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text. Uses browser-native Web Crypto APIs — no data sent to servers. Free and instant.',
  path: '/hash-generator',
  keywords: [
    'sha256 generator',
    'md5 generator',
    'hash generator',
    'sha1 hash online',
    'sha512 generator',
    'online hash tool',
    'web crypto hash',
  ],
})

const faqs = [
  {
    question: 'What hash algorithms are supported?',
    answer:
      'The tool supports MD5, SHA-1, SHA-256, and SHA-512. SHA-256 and SHA-512 use the browser\'s native Web Crypto API. MD5 uses a pure JavaScript implementation since it is not in the Web Crypto standard.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. All hashing is performed locally in your browser. Your input text is never sent to any server. SHA-256 and SHA-512 use the browser\'s hardware-accelerated crypto.subtle API.',
  },
  {
    question: 'What is a hash used for?',
    answer:
      'Hashes are used to verify file integrity, store passwords securely (with a proper algorithm like bcrypt for passwords), generate checksums, and create digital fingerprints of data.',
  },
  {
    question: 'Should I use MD5 or SHA-1 for security?',
    answer:
      'No. MD5 and SHA-1 are considered cryptographically broken for security purposes. Use SHA-256 or SHA-512 for anything security-sensitive. MD5 and SHA-1 are still useful for non-security purposes like checksums.',
  },
  {
    question: 'Can I hash a file with this tool?',
    answer:
      'This tool hashes text input. For file hashing, you would need to read the file as a binary ArrayBuffer. File hashing support may be added in a future update.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function HashGeneratorPage() {
  const toolUrl = `${siteUrl}/hash-generator`
  const appLD = webApplicationLD({
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using browser-native Web Crypto APIs.',
    url: toolUrl,
    keywords: ['sha256 generator', 'md5 generator', 'hash generator'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <HashGeneratorTool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Cryptographic Hash Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter any text and generate MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously.
                  SHA-1, SHA-256, and SHA-512 use the browser&apos;s hardware-accelerated
                  <code className="text-xs font-mono bg-muted px-1 rounded mx-1">crypto.subtle</code>
                  Web Crypto API. No data is sent to any server.
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
