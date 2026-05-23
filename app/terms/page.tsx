import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Terms of Service – DevTools Suite',
  description: 'DevTools Suite terms of service. Free tools provided as-is for personal and professional developer use.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="flex gap-8">

        {/* Left: content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().getFullYear()}</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Use of Service</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevTools Suite provides free developer tools for personal and professional use. The
                tools are provided &quot;as is&quot; without warranty of any kind. By using this
                site you agree to these terms.
              </p>
            </div>

            <AdSlot variant="banner" className="my-2" />

            <div>
              <h2 className="text-lg font-semibold mb-2">No Warranties</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We make no guarantees about the accuracy, reliability, or availability of these
                tools. Always verify tool output before using it in production systems. The service
                may be changed, interrupted, or discontinued at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Limitation of Liability</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevTools Suite is not liable for any damages arising from use of these tools,
                including but not limited to data loss, security incidents, downtime, or incorrect
                output. Your use of these tools is entirely at your own risk.
              </p>
            </div>

            <AdSlot variant="banner" className="my-2" />

            <div>
              <h2 className="text-lg font-semibold mb-2">Acceptable Use</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Do not use these tools for illegal purposes, to process data you do not have the
                right to access, or to violate any applicable laws or regulations. We reserve the
                right to block access for misuse.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Intellectual Property</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The DevTools Suite name, logo, and site design are our property. The underlying
                open-source libraries used by the tools retain their respective licenses.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Changes to Terms</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update these terms at any time. Continued use of the site after changes
                constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>
        </div>

        {/* Right: sidebar ads */}
        <aside className="hidden xl:block w-[300px] 2xl:w-[600px] shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <AdSlot variant="sidebar-wide" />
            <AdSlot variant="sidebar" />
            <AdSlot variant="sidebar" />
          </div>
        </aside>

      </div>
    </div>
  )
}
