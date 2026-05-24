import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { SQLFormatterTool } from '@/components/tools/sql-formatter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'SQL Formatter – Free Online SQL Beautifier & Minifier',
  description:
    'Format and beautify SQL queries with proper indentation, or minify SQL to a single line. Supports MySQL, PostgreSQL, SQLite, T-SQL, and BigQuery. No login required.',
  path: '/sql-formatter',
  keywords: [
    'sql formatter',
    'sql beautifier',
    'format sql online',
    'sql minifier',
    'sql pretty print',
    'mysql formatter',
    'postgresql formatter',
  ],
})

const faqs = [
  {
    question: 'What SQL dialects are supported?',
    answer:
      'The formatter supports Standard SQL, MySQL, PostgreSQL, SQLite, T-SQL (SQL Server), and BigQuery. Select your dialect from the dropdown for best results.',
  },
  {
    question: 'Does the formatter validate SQL?',
    answer:
      'The tool performs basic structural formatting. It will show an error if the SQL is so malformed it cannot be parsed. It does not validate SQL against a live database schema.',
  },
  {
    question: 'Is my SQL data safe?',
    answer:
      'Yes. All formatting happens in your browser using the sql-formatter JavaScript library. No SQL is ever sent to any server.',
  },
  {
    question: 'Can I format stored procedures or complex queries?',
    answer:
      'Yes. The formatter handles complex queries including subqueries, CTEs (WITH clauses), JOINs, window functions, and most standard SQL constructs.',
  },
  {
    question: 'What does minify do?',
    answer:
      'Minify collapses the SQL query to a single line by removing extra whitespace and newlines. This is useful for embedding SQL in strings, config files, or URLs.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function SQLFormatterPage() {
  const toolUrl = `${siteUrl}/sql-formatter`
  const appLD = webApplicationLD({
    name: 'SQL Formatter',
    description: 'Beautify or minify SQL queries with dialect-aware formatting.',
    url: toolUrl,
    keywords: ['sql formatter', 'sql beautifier', 'format sql online'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <SQLFormatterTool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">SQL Formatter and Beautifier</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste any SQL query and instantly beautify it with consistent indentation and
                  uppercase keywords, or minify it to a compact single line. Select from six SQL
                  dialects for dialect-aware formatting. The sql-formatter library runs entirely in
                  your browser — no SQL is transmitted anywhere.
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
