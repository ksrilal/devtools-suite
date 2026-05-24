import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { TailwindPlaygroundTool } from '@/components/tools/tailwind-playground-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Tailwind CSS Playground – Live Tailwind Class Preview Online',
  description:
    'Experiment with Tailwind CSS utility classes live. Edit classes and content, see the real-time preview, toggle desktop/mobile, and copy the HTML. Free, browser-based.',
  path: '/tailwind-playground',
  keywords: [
    'tailwind playground',
    'tailwind css online',
    'tailwind live preview',
    'tailwind class editor',
    'tailwindcss playground',
    'tailwind ui builder',
  ],
})

const faqs = [
  {
    question: 'Do the Tailwind classes actually render correctly?',
    answer: "Yes. The preview renders using real Tailwind CSS classes from this site's stylesheet. Utility classes already in the build output will render correctly. Custom or arbitrary values may not appear if they're not present in the compiled CSS.",
  },
  {
    question: 'What are the preset snippets?',
    answer: 'The tool includes preset components — Card, Button, Badge, Alert, Input, and Gradient Hero — to help you quickly explore common patterns and adapt them.',
  },
  {
    question: 'Can I toggle between mobile and desktop preview?',
    answer: 'Yes. Use the viewport toggle buttons to constrain the preview to a 375px mobile width or expand to full desktop width.',
  },
  {
    question: 'What HTML does it generate?',
    answer: 'The tool outputs a simple <div> with your Tailwind classes applied and your content inside. You can copy this HTML and paste it directly into your project.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function TailwindPlaygroundPage() {
  const toolUrl = `${siteUrl}/tailwind-playground`
  const appLD = webApplicationLD({
    name: 'Tailwind CSS Playground',
    description: 'Live Tailwind CSS class editor with real-time preview and mobile/desktop toggle.',
    url: toolUrl,
    keywords: ['tailwind playground', 'tailwind css online', 'tailwind live preview'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <TailwindPlaygroundTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Tailwind CSS Live Playground</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type Tailwind utility classes and see the styled element update in real time. Use preset snippets as starting points, toggle between mobile and desktop preview widths, and copy the generated HTML with one click.
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
