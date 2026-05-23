import type { Metadata } from 'next'

const SITE_URL =
  process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtools-suite.vercel.app'

interface ToolMetadataOptions {
  title: string
  description: string
  path: string
  keywords?: string[]
}

export function toolMetadata({
  title,
  description,
  path,
  keywords = [],
}: ToolMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | DevTools Suite`,
      description,
      url,
      type: 'website',
    },
    twitter: {
      title: `${title} | DevTools Suite`,
      description,
    },
  }
}

export function webApplicationLD(opts: {
  name: string
  description: string
  url: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    keywords: opts.keywords?.join(', ') ?? '',
  }
}

export function faqPageLD(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}
