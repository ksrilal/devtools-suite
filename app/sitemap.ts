import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/checklist', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/json-formatter', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/cron-generator', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/diff-checker', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/jwt-decoder', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/regex-tester', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/base64-encoder-decoder', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/uuid-generator', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/url-encoder-decoder', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/markdown-previewer', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/sql-formatter', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/color-converter', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/hash-generator', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/yaml-json-converter', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/json-ts-generator',   priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/csv-json-converter',  priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/timestamp-converter', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/case-converter',      priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/password-generator',  priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/jwt-generator',       priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/xml-formatter',       priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/qr-code-generator',        priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/json-zod-generator',       priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/flexbox-playground',       priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/api-request-builder',      priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/json-schema-generator',    priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/bcrypt-generator',         priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/openapi-viewer',           priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/tailwind-playground',      priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/json-to-dart',             priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/json-to-csharp',           priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/docker-compose-formatter', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/contact', priority: 0.4, changeFrequency: 'yearly' as const },
  ]

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
