import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JsonZodGeneratorTool } from '@/components/tools/json-zod-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JSON to Zod Schema Generator – TypeScript Zod Validator Online',
  description:
    'Generate Zod schemas from JSON instantly. Supports nested objects, arrays, strict mode, and TypeScript type inference. Free, browser-based, no data sent anywhere.',
  path: '/json-zod-generator',
  keywords: [
    'json to zod',
    'zod schema generator',
    'typescript zod generator',
    'generate zod schema from json',
    'zod validator',
    'zod typescript',
  ],
})

const faqs = [
  {
    question: 'What is Zod?',
    answer: 'Zod is a TypeScript-first schema declaration and validation library. It lets you define schemas for your data and automatically infer TypeScript types from them.',
  },
  {
    question: 'What does strict mode do?',
    answer: 'Strict mode adds .strict() to every z.object(), which causes Zod to reject any object containing keys not defined in the schema. It also generates z.number().int() for integer values.',
  },
  {
    question: 'Does this handle nested objects and arrays?',
    answer: 'Yes. The generator recurses into nested objects and arrays up to 8 levels deep, creating named Zod object schemas at each level.',
  },
  {
    question: 'Is my JSON sent to a server?',
    answer: 'No. All generation is performed with JavaScript running in your browser. Your data never leaves your device.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function JsonZodGeneratorPage() {
  const toolUrl = `${siteUrl}/json-zod-generator`
  const appLD = webApplicationLD({
    name: 'JSON to Zod Schema Generator',
    description: 'Generate Zod schemas from JSON with TypeScript type inference.',
    url: toolUrl,
    keywords: ['json to zod', 'zod schema generator', 'zod typescript'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <JsonZodGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JSON to Zod Schema Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any JSON object and get a ready-to-use Zod schema with an auto-inferred TypeScript type. The generator handles nested objects, arrays, null values, integers vs floats, and optional strict mode — all in your browser.
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
