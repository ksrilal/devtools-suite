import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { MarkdownPreviewerTool } from '@/components/tools/markdown-previewer-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Markdown Previewer – Free Live Markdown Editor & Preview',
  description:
    'Write Markdown with a live GitHub-style preview side by side. Sanitized HTML output, real-time rendering, mobile responsive. No login, no uploads.',
  path: '/markdown-previewer',
  keywords: [
    'markdown preview',
    'markdown editor',
    'live markdown preview',
    'markdown to html',
    'online markdown editor',
    'github markdown preview',
  ],
})

const faqs = [
  {
    question: 'What Markdown features are supported?',
    answer:
      'This tool supports the full CommonMark specification plus GitHub Flavored Markdown (GFM) extensions including tables, task lists, strikethrough, and fenced code blocks.',
  },
  {
    question: 'Is the rendered HTML safe?',
    answer:
      'Yes. The rendered HTML is sanitized with DOMPurify before being displayed, which removes any potentially dangerous content like JavaScript event handlers or malicious links.',
  },
  {
    question: 'Can I use this as a Markdown editor?',
    answer:
      'Yes. You can write Markdown in the editor pane and see the styled result in real-time. Use the Copy MD button to copy your Markdown to the clipboard.',
  },
  {
    question: 'Does it support GitHub Flavored Markdown?',
    answer:
      'Yes. The tool uses the marked library with GFM mode enabled, which supports tables, strikethrough (~~text~~), task list items, and auto-linking URLs.',
  },
  {
    question: 'Can I use this on mobile?',
    answer:
      'Yes. On smaller screens, use the Editor or Preview view mode buttons to switch between editing and viewing. The split view is available on larger screens.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function MarkdownPreviewerPage() {
  const toolUrl = `${siteUrl}/markdown-previewer`
  const appLD = webApplicationLD({
    name: 'Markdown Previewer',
    description: 'Write Markdown with a live GitHub-style preview.',
    url: toolUrl,
    keywords: ['markdown preview', 'markdown editor', 'live markdown preview'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <MarkdownPreviewerTool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Live Markdown Editor and Previewer</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Write Markdown in the editor and see a GitHub-style rendered preview update in
                  real-time. Supports the CommonMark specification plus GitHub Flavored Markdown
                  extensions: tables, task lists, strikethrough, and fenced code blocks. Rendered
                  HTML is sanitized with DOMPurify to prevent XSS. All processing happens in your
                  browser.
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
