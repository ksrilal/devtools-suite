import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { ApiRequestBuilderTool } from '@/components/tools/api-request-builder-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'API Request Builder – Online HTTP Client & REST Tester',
  description:
    'Build and send HTTP requests (GET, POST, PUT, PATCH, DELETE) directly from your browser. Set headers, query params, and JSON body. View responses and copy cURL commands. No backend.',
  path: '/api-request-builder',
  keywords: [
    'api request builder',
    'http client online',
    'rest api tester',
    'curl builder',
    'api testing tool',
    'postman alternative',
  ],
})

const faqs = [
  {
    question: 'Does this tool send requests through a proxy?',
    answer: 'No. Requests are sent directly from your browser using the native Fetch API. There is no backend proxy — your request goes straight to the target API.',
  },
  {
    question: 'Why do some requests fail with a CORS error?',
    answer: "CORS (Cross-Origin Resource Sharing) is a browser security feature. If the API does not include the appropriate CORS headers (Access-Control-Allow-Origin), the browser will block the response. This is a limitation of browser-based HTTP clients — server-side tools like Postman's desktop agent bypass CORS.",
  },
  {
    question: 'Is my API data stored anywhere?',
    answer: 'No. Request data, headers, and response bodies are only kept in memory for the current session. Nothing is stored locally or sent to any server.',
  },
  {
    question: 'What is the cURL command for?',
    answer: 'The generated cURL command lets you reproduce the exact same request in a terminal, where CORS restrictions do not apply.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function ApiRequestBuilderPage() {
  const toolUrl = `${siteUrl}/api-request-builder`
  const appLD = webApplicationLD({
    name: 'API Request Builder',
    description: 'Build and send HTTP requests directly from your browser with response inspection.',
    url: toolUrl,
    keywords: ['api request builder', 'http client online', 'rest api tester'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <ApiRequestBuilderTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Browser-Based API Request Builder</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Configure HTTP requests with method, URL, query parameters, headers, and a JSON body editor. Responses are displayed with status code, timing, response headers, and a formatted body view. Requests go directly to the target API — no proxy, no data storage.
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
