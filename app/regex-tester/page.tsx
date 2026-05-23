import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { RegexTesterTool } from '@/components/tools/regex-tester-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Regex Tester – Online Regular Expression Checker',
  description:
    'Free online regex tester and validator. Test regular expressions with live match highlighting, flags, replace preview, and pattern explanations. No login required.',
  path: '/regex-tester',
  keywords: [
    'regex tester',
    'regex checker',
    'regular expression tester',
    'regex validator',
    'online regex',
    'regex match tester',
  ],
})

const faqs = [
  {
    question: 'What regex flavour does this tool use?',
    answer:
      'The regex tester uses the JavaScript RegExp engine built into your browser. Most common regex patterns work, but some flavours (PCRE lookbehind of variable length, atomic groups) may differ.',
  },
  {
    question: 'What flags are supported?',
    answer:
      'g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode), and d (indices). Combine flags like "gi" for case-insensitive global matching.',
  },
  {
    question: 'How does the replace preview work?',
    answer:
      'Enter a replacement string in the Replace field. Use $1, $2, etc. to reference capture groups, and $& for the full match. The preview updates live.',
  },
  {
    question: 'What does the regex explanation show?',
    answer:
      'The explanation breaks down your regex pattern into individual tokens (anchors, metacharacters, quantifiers, groups) and describes what each part matches.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtools-suite.vercel.app'

export default function RegexTesterPage() {
  const toolUrl = `${siteUrl}/regex-tester`
  const appLD = webApplicationLD({
    name: 'Regex Tester',
    description: 'Test regular expressions with live matching, flags, replace preview and explanations.',
    url: toolUrl,
    keywords: ['regex tester', 'regex checker', 'regular expression tester'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <RegexTesterTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Regex Tester and Regular Expression Checker</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Write a regular expression and test it instantly against your input. Matches are
                  highlighted inline with match count and position details. Enable the replace tab to
                  preview substitutions using capture group references.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The pattern explainer breaks down complex regex into human-readable descriptions of
                  each token, helping you understand what your expression actually matches.
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
