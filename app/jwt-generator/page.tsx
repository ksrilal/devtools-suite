import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JWTGeneratorTool } from '@/components/tools/jwt-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JWT Generator – Generate & Sign JWTs Online with HS256',
  description:
    'Generate and sign JWT tokens locally using HS256 and browser Web Crypto API. Edit header and payload JSON, set a secret, and get a signed token instantly. No server.',
  path: '/jwt-generator',
  keywords: [
    'jwt generator',
    'generate jwt token',
    'jwt hs256 generator',
    'json web token generator',
    'jwt sign online',
    'jwt creator',
  ],
})

const faqs = [
  {
    question: 'What signing algorithm is supported?',
    answer: 'Currently HS256 (HMAC with SHA-256) is supported. This uses a shared secret to sign the token. The browser\'s native crypto.subtle.sign() API is used — no external libraries.',
  },
  {
    question: 'Is my secret key safe?',
    answer: 'Yes. The secret is used locally in your browser to compute the HMAC signature. It is never sent to any server. Close the tab to clear it from memory.',
  },
  {
    question: 'Can I decode the generated token?',
    answer: 'Yes. The tool automatically decodes and displays the header and payload sections of the generated token below the token output.',
  },
  {
    question: 'What are iat and exp in the payload?',
    answer: 'iat (issued at) is the Unix timestamp when the token was created. exp (expiration) is the Unix timestamp after which the token is no longer valid. Both are standard JWT claims.',
  },
  {
    question: 'Can I use this to test my API?',
    answer: 'Yes. Copy the generated token and use it as a Bearer token in your API requests (Authorization: Bearer <token>). Make sure your API uses the same secret for verification.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function JWTGeneratorPage() {
  const toolUrl = `${siteUrl}/jwt-generator`
  const appLD = webApplicationLD({
    name: 'JWT Generator',
    description: 'Generate and sign JWT tokens locally using HS256 and the browser Web Crypto API.',
    url: toolUrl,
    keywords: ['jwt generator', 'generate jwt token', 'jwt hs256'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <JWTGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JWT Token Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Edit the header and payload JSON, enter your HS256 secret, and the signed JWT is generated live as you type. The token is colour-coded by segment (header · payload · signature). Use the existing <a href="/jwt-decoder" className="underline underline-offset-2 hover:text-foreground">JWT Decoder</a> to inspect tokens you receive. All signing uses the browser&apos;s <code className="text-xs font-mono bg-muted px-1 rounded">crypto.subtle</code> API — no secrets leave your device.
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
