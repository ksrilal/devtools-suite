import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JsonSchemaGeneratorTool } from '@/components/tools/json-schema-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JSON Schema Generator – Generate JSON Schema from JSON Online',
  description:
    'Generate JSON Schema (draft 2020-12) from any JSON object. Supports nested objects, arrays, required fields, and additionalProperties. Free, browser-based.',
  path: '/json-schema-generator',
  keywords: [
    'json schema generator',
    'generate json schema',
    'json validation schema',
    'json schema from json',
    'json schema draft 2020',
    'json schema online',
  ],
})

const faqs = [
  {
    question: 'What is JSON Schema?',
    answer: 'JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It is used to define the structure, data types, and constraints of JSON data — commonly used in APIs, form validation, and configuration files.',
  },
  {
    question: 'Which JSON Schema draft does this tool target?',
    answer: 'The generator outputs schemas compatible with JSON Schema Draft 2020-12, the latest published specification.',
  },
  {
    question: 'What does additionalProperties: false mean?',
    answer: 'This keyword causes validators to reject JSON objects that contain properties not defined in the schema. The generator adds this by default for strict validation.',
  },
  {
    question: 'Is my JSON data uploaded anywhere?',
    answer: 'No. Schema generation runs entirely in JavaScript within your browser. Your JSON content never leaves your device.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function JsonSchemaGeneratorPage() {
  const toolUrl = `${siteUrl}/json-schema-generator`
  const appLD = webApplicationLD({
    name: 'JSON Schema Generator',
    description: 'Generate JSON Schema (draft 2020-12) from JSON objects with nested object support.',
    url: toolUrl,
    keywords: ['json schema generator', 'generate json schema', 'json validation schema'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <JsonSchemaGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JSON Schema Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any JSON document and get a complete JSON Schema with $schema, $id, title, type definitions, required arrays, and additionalProperties constraints — ready for use in validators like Ajv, jsonschema, or API gateways.
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
