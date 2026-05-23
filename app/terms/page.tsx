import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = toolMetadata({
  title: 'Terms of Service – DevTools Suite',
  description: 'DevTools Suite terms of service. Free tools provided as-is for developer use.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().getFullYear()}</p>
      <div className="prose dark:prose-invert space-y-4">
        <h2>Use of Service</h2>
        <p>
          DevTools Suite provides free developer tools for personal and professional use. The tools
          are provided &quot;as is&quot; without warranty of any kind.
        </p>
        <h2>No Warranties</h2>
        <p>
          We make no guarantees about the accuracy, reliability, or availability of these tools.
          Always verify tool output before using it in production systems.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          DevTools Suite is not liable for any damages arising from use of these tools, including
          data loss, security incidents, or incorrect output.
        </p>
        <h2>Acceptable Use</h2>
        <p>
          Do not use these tools for illegal purposes or to process data you do not have the right
          to access.
        </p>
      </div>
    </div>
  )
}
