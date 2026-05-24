import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { OpenApiViewerTool } from '@/components/tools/openapi-viewer-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'OpenAPI Viewer – Browse Swagger & OpenAPI Specs Online',
  description:
    'Paste OpenAPI 3.x or Swagger 2.x JSON/YAML and browse endpoints, parameters, responses, and authentication locally. No upload, no server, privacy-first.',
  path: '/openapi-viewer',
  keywords: [
    'openapi viewer',
    'swagger viewer online',
    'openapi spec viewer',
    'api documentation viewer',
    'openapi explorer',
    'swagger ui alternative',
  ],
})

const faqs = [
  {
    question: 'Which OpenAPI versions are supported?',
    answer: 'The viewer supports OpenAPI 3.x (OAS3) and Swagger 2.x specifications in both JSON and YAML formats.',
  },
  {
    question: 'Is my API spec uploaded to a server?',
    answer: 'No. Parsing happens entirely in your browser using js-yaml for YAML parsing. Your spec never leaves your device.',
  },
  {
    question: 'Does this render interactive API calls?',
    answer: 'The viewer focuses on readable documentation — endpoints, parameters, request bodies, and responses. For interactive testing, use the API Request Builder tool.',
  },
  {
    question: 'Can I search for specific endpoints?',
    answer: 'Yes. Use the search bar to filter endpoints by path, HTTP method, summary text, or tag.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function OpenApiViewerPage() {
  const toolUrl = `${siteUrl}/openapi-viewer`
  const appLD = webApplicationLD({
    name: 'OpenAPI Viewer',
    description: 'Browse OpenAPI and Swagger specs locally with endpoint search and collapsible sections.',
    url: toolUrl,
    keywords: ['openapi viewer', 'swagger viewer online', 'openapi spec viewer'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <OpenApiViewerTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">OpenAPI & Swagger Spec Viewer</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any OpenAPI 3.x or Swagger 2.x spec (JSON or YAML) to get a clean, browseable documentation view. Endpoints are grouped by tag, searchable, and expandable to show parameters, request bodies, and response codes — all parsed locally.
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
