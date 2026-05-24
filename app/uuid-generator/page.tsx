import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { UUIDGeneratorTool } from '@/components/tools/uuid-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'UUID Generator – Free Online GUID / UUID v4 Generator',
  description:
    'Generate cryptographically random UUID v4 values instantly. Generate up to 50 UUIDs at once, copy individually or all together. Free, browser-based, no login.',
  path: '/uuid-generator',
  keywords: [
    'uuid generator',
    'guid generator',
    'random uuid',
    'uuid v4',
    'generate uuid online',
    'unique identifier generator',
  ],
})

const faqs = [
  {
    question: 'What is a UUID?',
    answer:
      'A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify objects in computer systems. The standard format is eight groups of hexadecimal digits separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.',
  },
  {
    question: 'What is UUID v4?',
    answer:
      'UUID v4 is randomly generated. All 128 bits are random (except for a few version/variant bits), making the probability of collision astronomically small — about 1 in 5.3 × 10³⁶ for any two v4 UUIDs.',
  },
  {
    question: 'Are these UUIDs cryptographically random?',
    answer:
      'Yes. This tool uses the browser\'s built-in crypto.randomUUID() API, which uses a cryptographically secure pseudo-random number generator (CSPRNG).',
  },
  {
    question: 'What is the difference between UUID and GUID?',
    answer:
      'GUID (Globally Unique Identifier) is Microsoft\'s implementation of the UUID standard. They are functionally identical — UUID is the formal standard, GUID is the Microsoft-branded term.',
  },
  {
    question: 'Can I use these UUIDs in a database?',
    answer:
      'Yes. UUID v4 values are suitable as primary keys, foreign keys, or any other identifier in databases like PostgreSQL, MySQL, MongoDB, or SQLite. Many databases have a native UUID type.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function UUIDGeneratorPage() {
  const toolUrl = `${siteUrl}/uuid-generator`
  const appLD = webApplicationLD({
    name: 'UUID Generator',
    description: 'Generate cryptographically random UUID v4 values in your browser.',
    url: toolUrl,
    keywords: ['uuid generator', 'guid generator', 'random uuid'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <UUIDGeneratorTool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">UUID v4 Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate one or up to 50 RFC 4122 compliant UUID v4 values in a single click.
                  The tool uses the browser&apos;s native <code className="text-xs font-mono bg-muted px-1 rounded">crypto.randomUUID()</code> API
                  for cryptographically secure random generation. Copy individual UUIDs or all at once.
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
