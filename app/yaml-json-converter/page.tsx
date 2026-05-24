import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { YAMLJSONConverterTool } from '@/components/tools/yaml-json-converter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'YAML ↔ JSON Converter – Free Online YAML to JSON Tool',
  description:
    'Convert YAML to JSON or JSON to YAML instantly with validation and pretty-printing. Free, browser-based, no login. Supports all standard YAML and JSON syntax.',
  path: '/yaml-json-converter',
  keywords: [
    'yaml to json',
    'json to yaml',
    'yaml converter',
    'yaml json online',
    'convert yaml',
    'yaml parser',
  ],
})

const faqs = [
  {
    question: 'What YAML features are supported?',
    answer:
      'The converter supports all standard YAML 1.2 features including anchors and aliases, multi-line strings, nested objects and arrays, null values, booleans, and numbers. It uses the js-yaml library.',
  },
  {
    question: 'What happens if my YAML or JSON is invalid?',
    answer:
      'The tool shows an error message describing what went wrong, including the location in the input where the parse error occurred.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. All conversion happens locally in your browser using the js-yaml JavaScript library. No data is ever sent to a server.',
  },
  {
    question: 'Will comments in YAML be preserved?',
    answer:
      'No. YAML comments are not part of the data model, so they are lost during the YAML → JSON → YAML round-trip. This is a fundamental YAML specification limitation.',
  },
  {
    question: 'Can I convert Kubernetes or Docker Compose files?',
    answer:
      'Yes. These are standard YAML files and are fully supported. The tool will correctly parse all YAML types used in Kubernetes manifests and Docker Compose files.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function YAMLJSONConverterPage() {
  const toolUrl = `${siteUrl}/yaml-json-converter`
  const appLD = webApplicationLD({
    name: 'YAML ↔ JSON Converter',
    description: 'Convert between YAML and JSON formats with validation and pretty-printing.',
    url: toolUrl,
    keywords: ['yaml to json', 'json to yaml', 'yaml converter'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <YAMLJSONConverterTool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">YAML and JSON Converter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste YAML to convert it to formatted JSON, or paste JSON to convert it to clean
                  YAML. The tool validates input and reports parse errors immediately. Powered by the
                  js-yaml library running in your browser — no data is sent anywhere. Supports all
                  standard YAML 1.2 syntax including anchors, multi-line strings, and nested structures.
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
