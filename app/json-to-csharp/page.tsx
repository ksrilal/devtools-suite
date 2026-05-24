import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JsonToCSharpTool } from '@/components/tools/json-to-csharp-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JSON to C# Classes Generator – Generate C# Models from JSON',
  description:
    'Generate C# model classes from JSON with PascalCase properties, System.Text.Json attributes, nullable types, and namespace support. Free, browser-based.',
  path: '/json-to-csharp',
  keywords: [
    'json to csharp',
    'c# model generator',
    'json to class',
    'c# class from json',
    'json to c# model',
    'csharp json generator',
  ],
})

const faqs = [
  {
    question: 'What C# serialization attributes are added?',
    answer: 'The generator adds [JsonPropertyName("key")] from System.Text.Json.Serialization — the standard attribute for .NET 5+ JSON serialization. This maps JSON camelCase keys to C# PascalCase properties.',
  },
  {
    question: 'Does it handle nested objects?',
    answer: 'Yes. Nested JSON objects generate separate named C# classes within the same namespace. The parent class references child classes by name.',
  },
  {
    question: 'What does the nullable option do?',
    answer: 'With nullable types enabled, string, object, and value types are generated with the ? nullable annotation, suitable for C# 8+ nullable reference types projects.',
  },
  {
    question: 'Is my JSON sent to a server?',
    answer: 'No. All code generation runs in JavaScript within your browser. Your JSON never leaves your device.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function JsonToCSharpPage() {
  const toolUrl = `${siteUrl}/json-to-csharp`
  const appLD = webApplicationLD({
    name: 'JSON to C# Classes Generator',
    description: 'Generate C# model classes from JSON with PascalCase properties and System.Text.Json attributes.',
    url: toolUrl,
    keywords: ['json to csharp', 'c# model generator', 'json to class'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <JsonToCSharpTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JSON to C# Class Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any JSON object and get C# classes with PascalCase property names, JsonPropertyName attributes for System.Text.Json, optional nullable types, and namespace wrapping. Nested objects become separate named classes automatically.
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
