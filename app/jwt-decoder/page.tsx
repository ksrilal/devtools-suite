import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { JWTDecoderTool } from '@/components/tools/jwt-decoder-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'JWT Decoder – Decode JWT Tokens Online Free',
  description:
    'Free online JWT decoder. Decode JWT tokens, inspect header and payload claims, check expiry and issued-at times. 100% client-side — your token never leaves your browser.',
  path: '/jwt-decoder',
  keywords: [
    'jwt decoder',
    'decode jwt',
    'jwt token decoder',
    'jwt inspector',
    'jwt claims viewer',
    'json web token decoder',
  ],
})

const faqs = [
  {
    question: 'Is it safe to decode my JWT here?',
    answer:
      'Yes. The decoder runs entirely in your browser using JavaScript. Your token is never sent to any server. This tool only decodes the header and payload — it does NOT verify the signature.',
  },
  {
    question: 'What is the difference between decoding and verifying a JWT?',
    answer:
      'Decoding reads the header and payload from the token (they are base64-encoded, not encrypted). Verifying checks the signature against a secret key to confirm the token was issued by a trusted source. This tool decodes only.',
  },
  {
    question: 'What does "token expired" mean?',
    answer:
      'JWTs contain an exp claim (expiration time) as a Unix timestamp. If the current time is past that timestamp, the token is expired and should not be accepted.',
  },
  {
    question: 'What are standard JWT claims?',
    answer:
      'Standard claims include iss (issuer), sub (subject), aud (audience), exp (expiration), nbf (not before), iat (issued at), and jti (JWT ID). The tool labels these automatically.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtools-suite.vercel.app'

export default function JWTDecoderPage() {
  const toolUrl = `${siteUrl}/jwt-decoder`
  const appLD = webApplicationLD({
    name: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens with claim annotations and expiry checking.',
    url: toolUrl,
    keywords: ['jwt decoder', 'decode jwt', 'jwt inspector'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <JWTDecoderTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">JWT Decoder and Token Inspector</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Paste any JWT token to instantly decode its header and payload. Standard claims like
                  expiry, issuer, and subject are labelled automatically. The tool shows whether the
                  token is still valid, expired, or not yet active based on your local time.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Security note:</strong> JWTs are base64-encoded, not encrypted. This decoder
                  reads the payload without verifying the signature — never trust decoded claims in
                  production without server-side signature verification.
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
