import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JSONTSGeneratorTool } from '@/components/tools/json-ts-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JSON to TypeScript Generator – Free Online TS Interface Generator',
  description:
    'Paste JSON and instantly generate TypeScript interfaces and types. Handles nested objects, arrays, and optional fields. Free, browser-based, no login.',
  path: '/json-ts-generator',
  keywords: [
    'json to typescript',
    'json typescript generator',
    'generate typescript interfaces',
    'json to ts',
    'typescript type generator',
    'json interface generator',
  ],
})

const faqs = [
  {
    question: 'How does the generator handle nested objects?',
    answer: 'Each nested object becomes its own named interface, derived from the property key in PascalCase. The parent interface references the child interface by name.',
  },
  {
    question: 'How are arrays typed?',
    answer: 'Arrays are typed based on their elements. A string array becomes string[], an object array generates a separate interface for the element type (e.g. ItemItem[]).',
  },
  {
    question: 'What happens with mixed-type arrays?',
    answer: 'If an array contains elements of different types, the generator creates a union type, e.g. (string | number)[].',
  },
  {
    question: 'Is my JSON data sent anywhere?',
    answer: 'No. All TypeScript generation is done in your browser using pure JavaScript. Nothing is transmitted to any server.',
  },
  {
    question: 'Can I change the root interface name?',
    answer: 'Yes. Use the Root name field in the toolbar to set a custom name for the top-level interface.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function JSONTSGeneratorPage() {
  const toolUrl = `${siteUrl}/json-ts-generator`
  const appLD = webApplicationLD({
    name: 'JSON to TypeScript Generator',
    description: 'Generate TypeScript interfaces from JSON data instantly in your browser.',
    url: toolUrl,
    keywords: ['json to typescript', 'typescript interface generator', 'json to ts'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <JSONTSGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JSON to TypeScript Interface Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any valid JSON object or array and instantly get a set of typed TypeScript interfaces. The generator handles nested objects, arrays of primitives, arrays of objects, null values, and mixed-type arrays. Rename the root interface using the toolbar. Download the result as a <code className="text-xs font-mono bg-muted px-1 rounded">.ts</code> file. All processing happens locally — no data leaves your browser.
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
