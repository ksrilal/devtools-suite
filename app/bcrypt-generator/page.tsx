import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { BcryptGeneratorTool } from '@/components/tools/bcrypt-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Bcrypt Generator – Hash & Verify Passwords Online',
  description:
    'Generate bcrypt hashes and verify passwords locally in your browser. Adjustable salt rounds (4–16). No data is transmitted — everything runs client-side.',
  path: '/bcrypt-generator',
  keywords: [
    'bcrypt generator',
    'bcrypt hash online',
    'password hash generator',
    'bcrypt verify',
    'hash password online',
    'bcrypt salt rounds',
  ],
})

const faqs = [
  {
    question: 'What is bcrypt?',
    answer: 'Bcrypt is a password hashing algorithm designed to be computationally expensive to deter brute-force attacks. It incorporates a salt to protect against rainbow table attacks and a cost factor to scale with hardware improvements.',
  },
  {
    question: 'What are salt rounds?',
    answer: 'Salt rounds (also called cost factor) control how computationally intensive the hash is. Each increment doubles the time required. 10–12 rounds is the standard recommendation for most applications.',
  },
  {
    question: 'Can I reverse a bcrypt hash?',
    answer: 'No. Bcrypt is a one-way function — it is computationally infeasible to derive the original password from a hash. Verification works by re-hashing the candidate password and comparing the result.',
  },
  {
    question: 'Is this tool safe to use?',
    answer: 'Yes, for testing purposes. Bcrypt generation runs entirely in your browser using the bcryptjs library. No password or hash is ever sent to any server. However, never use this tool to hash passwords you use in production with real user data — use your backend runtime directly.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function BcryptGeneratorPage() {
  const toolUrl = `${siteUrl}/bcrypt-generator`
  const appLD = webApplicationLD({
    name: 'Bcrypt Generator',
    description: 'Generate and verify bcrypt password hashes locally in your browser.',
    url: toolUrl,
    keywords: ['bcrypt generator', 'bcrypt hash online', 'password hash generator'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <BcryptGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Bcrypt Password Hasher</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate bcrypt hashes for testing and verify passwords against existing hashes. Choose salt rounds to balance security and speed. All computation happens in your browser using bcryptjs — no password ever leaves your device.
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
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
