import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { FlexboxPlaygroundTool } from '@/components/tools/flexbox-playground-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Flexbox Playground – Interactive CSS Flexbox Visual Tool',
  description:
    'Experiment with CSS Flexbox interactively. Adjust flex-direction, justify-content, align-items, flex-wrap, gap and more with a live preview and generated CSS. Free online tool.',
  path: '/flexbox-playground',
  keywords: [
    'flexbox playground',
    'css flexbox tool',
    'flexbox visual editor',
    'flexbox generator',
    'css layout playground',
    'learn flexbox',
  ],
})

const faqs = [
  {
    question: 'What is CSS Flexbox?',
    answer: 'Flexbox (Flexible Box Layout) is a CSS layout model that provides an efficient way to lay out, align, and distribute space among items in a container, even when their sizes are dynamic.',
  },
  {
    question: 'What does align-content do vs align-items?',
    answer: 'align-items controls how flex items are aligned along the cross axis within a single line. align-content controls how multiple lines are aligned when flex-wrap is enabled and there is extra space on the cross axis.',
  },
  {
    question: 'What is flex-wrap?',
    answer: 'By default, flex items try to fit onto one line. flex-wrap: wrap allows items to wrap onto multiple lines when they exceed the container width.',
  },
  {
    question: 'Can I copy the generated CSS?',
    answer: 'Yes. The tool shows the complete CSS declaration for your current configuration, which you can copy with one click.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function FlexboxPlaygroundPage() {
  const toolUrl = `${siteUrl}/flexbox-playground`
  const appLD = webApplicationLD({
    name: 'Flexbox Playground',
    description: 'Interactive CSS Flexbox visual playground with live preview and CSS output.',
    url: toolUrl,
    keywords: ['flexbox playground', 'css flexbox tool', 'flexbox generator'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <FlexboxPlaygroundTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Interactive Flexbox Playground</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Adjust Flexbox properties with real-time controls and see the result instantly. Preset examples help you jump-start common layouts. Copy the generated CSS directly into your project.
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
