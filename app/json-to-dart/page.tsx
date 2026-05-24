import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JsonToDartTool } from '@/components/tools/json-to-dart-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JSON to Dart Model Generator – Flutter JSON Model Online',
  description:
    'Generate Dart model classes from JSON. Supports null safety, nested models, fromJson/toJson, and Flutter-friendly formatting. Free, browser-based.',
  path: '/json-to-dart',
  keywords: [
    'json to dart',
    'dart model generator',
    'flutter json model',
    'dart class from json',
    'json to dart class',
    'flutter model generator',
  ],
})

const faqs = [
  {
    question: 'Does this generate null-safe Dart code?',
    answer: 'Yes. With null safety enabled, the generator adds ? nullable type annotations for fields that could be null. It follows Dart 2.12+ null safety conventions.',
  },
  {
    question: 'What does fromJson/toJson do?',
    answer: 'fromJson is a factory constructor that creates a model instance from a Map<String, dynamic>. toJson returns the model as a Map for JSON serialization. Both are required for most REST API workflows in Flutter/Dart.',
  },
  {
    question: 'Does it handle nested objects?',
    answer: 'Yes. Nested JSON objects generate separate named Dart classes. The parent class references child classes by name.',
  },
  {
    question: 'Is my JSON sent to a server?',
    answer: 'No. All code generation runs entirely in JavaScript in your browser. Your JSON data never leaves your device.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function JsonToDartPage() {
  const toolUrl = `${siteUrl}/json-to-dart`
  const appLD = webApplicationLD({
    name: 'JSON to Dart Model Generator',
    description: 'Generate Dart model classes from JSON with null safety and fromJson/toJson support.',
    url: toolUrl,
    keywords: ['json to dart', 'dart model generator', 'flutter json model'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <JsonToDartTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JSON to Dart Model Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any JSON object and get ready-to-use Dart model classes for Flutter apps. Toggle null safety, fromJson/toJson factories, and set your root class name. Nested objects are automatically extracted into separate named classes.
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
