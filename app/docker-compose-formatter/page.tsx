import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { DockerComposeFormatterTool } from '@/components/tools/docker-compose-formatter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Docker Compose Formatter – Beautify & Validate docker-compose.yml Online',
  description:
    'Format, beautify, and minify Docker Compose YAML files with validation. Paste your docker-compose.yml and get clean, consistently indented output. Free, browser-based.',
  path: '/docker-compose-formatter',
  keywords: [
    'docker compose formatter',
    'docker yaml formatter',
    'docker compose beautifier',
    'format docker compose',
    'yaml formatter online',
    'docker compose validator',
  ],
})

const faqs = [
  {
    question: 'Does this only work with docker-compose.yml files?',
    answer: 'The formatter works with any valid YAML document. It is optimized for docker-compose files but will correctly format any YAML you paste.',
  },
  {
    question: 'Does it preserve comments?',
    answer: 'YAML comments are parsed but not preserved by the underlying YAML parser — this is a limitation of how YAML libraries parse documents. The formatter outputs clean, re-indented YAML without original comments.',
  },
  {
    question: 'What does minify do?',
    answer: 'Minify outputs the YAML in a compact flow-style format, reducing whitespace. Useful for embedding YAML in scripts or environment variables.',
  },
  {
    question: 'Is my docker-compose file sent to a server?',
    answer: 'No. Formatting and validation run entirely in your browser using js-yaml. Your file contents never leave your device.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function DockerComposeFormatterPage() {
  const toolUrl = `${siteUrl}/docker-compose-formatter`
  const appLD = webApplicationLD({
    name: 'Docker Compose Formatter',
    description: 'Format, beautify, and validate docker-compose YAML files locally in your browser.',
    url: toolUrl,
    keywords: ['docker compose formatter', 'docker yaml formatter', 'yaml formatter online'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <DockerComposeFormatterTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Docker Compose YAML Formatter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste your docker-compose.yml and get consistently indented, clean YAML output. The tool validates your YAML before formatting, reports syntax errors, and offers a minify mode. All processing happens locally — your compose files never leave your browser.
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
