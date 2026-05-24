import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { PasswordGeneratorTool } from '@/components/tools/password-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Password Generator – Secure Random Password Generator Online',
  description:
    'Generate cryptographically secure random passwords. Configure length, symbols, numbers, and case. Uses browser Web Crypto API — no passwords sent to any server.',
  path: '/password-generator',
  keywords: [
    'password generator',
    'secure password generator',
    'random password generator',
    'strong password generator',
    'online password generator',
    'crypto password generator',
  ],
})

const faqs = [
  {
    question: 'Are the generated passwords truly random?',
    answer: 'Yes. The tool uses the browser\'s crypto.getRandomValues() API which provides cryptographically secure pseudo-random numbers, suitable for generating passwords.',
  },
  {
    question: 'Are my passwords stored or sent anywhere?',
    answer: 'No. Passwords are generated entirely in your browser. Nothing is transmitted to any server. The generated passwords exist only in your browser\'s memory.',
  },
  {
    question: 'What does the strength indicator measure?',
    answer: 'The strength score checks: length (8+, 12+, 16+), presence of uppercase, lowercase, numbers, and symbols. A score of 6–7 is "strong", 5 is "good", 3–4 is "fair", and below is "weak".',
  },
  {
    question: 'How long should my password be?',
    answer: 'Security experts recommend at least 12 characters for most accounts and 16+ for high-value accounts. The tool defaults to 16 characters.',
  },
  {
    question: 'Can I generate multiple passwords at once?',
    answer: 'Yes. Use the count selector (1, 5, or 10) to generate multiple passwords in a single click. Copy them all at once with the Copy all button.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function PasswordGeneratorPage() {
  const toolUrl = `${siteUrl}/password-generator`
  const appLD = webApplicationLD({
    name: 'Password Generator',
    description: 'Generate cryptographically secure random passwords in your browser.',
    url: toolUrl,
    keywords: ['password generator', 'secure password generator', 'random password generator'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <PasswordGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Secure Password Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Configure password length (4–128 characters), toggle character sets (uppercase, lowercase, numbers, symbols), and generate one or more passwords with a single click. A strength indicator grades the result. All generation uses <code className="text-xs font-mono bg-muted px-1 rounded">crypto.getRandomValues()</code> — no passwords are ever transmitted to any server.
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
