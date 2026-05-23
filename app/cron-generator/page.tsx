import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { CronGeneratorTool } from '@/components/tools/cron-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Cron Expression Generator – Free Online Cron Builder',
  description:
    'Build and validate cron expressions visually. Human-readable descriptions, next 5 execution previews, AWS EventBridge and Spring @Scheduled support. Free, no login required.',
  path: '/cron-generator',
  keywords: [
    'cron expression generator',
    'cron builder',
    'cron parser',
    'cron validator',
    'aws eventbridge cron',
    'spring scheduled cron',
  ],
})

const faqs = [
  {
    question: 'What is a cron expression?',
    answer:
      'A cron expression is a string that defines a schedule. It consists of 5 fields: minute, hour, day of month, month, and day of week. Special characters like * (any), / (step), - (range), and , (list) allow flexible scheduling.',
  },
  {
    question: 'What is the difference between Unix cron and AWS EventBridge cron?',
    answer:
      'AWS EventBridge uses a 6-field format wrapped in cron(...) and requires a year field. It also uses ? for wildcard when day-of-month or day-of-week is specified.',
  },
  {
    question: 'How do I schedule a job to run every 5 minutes?',
    answer: 'Use the expression: */5 * * * * — this means "every 5 minutes, every hour, every day".',
  },
  {
    question: 'What does the next execution preview show?',
    answer:
      'It shows the next 5 times the cron expression will trigger, calculated from the current UTC time.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function CronGeneratorPage() {
  const toolUrl = `${siteUrl}/cron-generator`
  const appLD = webApplicationLD({
    name: 'Cron Expression Generator',
    description: 'Build cron expressions visually with human-readable descriptions and next execution previews.',
    url: toolUrl,
    keywords: ['cron generator', 'cron builder', 'cron parser'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <CronGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Cron Expression Generator and Parser</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Build cron expressions visually by setting each field — minute, hour, day of month,
                  month, and day of week — using intuitive inputs. The tool generates a human-readable
                  description of your schedule and shows the next 5 execution times in UTC.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Convert your expressions to AWS EventBridge format or Spring @Scheduled format with
                  one click. Supports all standard cron syntax including ranges, lists, steps, and wildcards.
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
