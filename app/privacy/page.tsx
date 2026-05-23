import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Privacy Policy – DevTools Suite',
  description: 'DevTools Suite privacy policy. All tools run locally in your browser. No data is collected or transmitted.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="flex gap-8">

        {/* Left: content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().getFullYear()}</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">What data we collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevTools Suite does not collect, store, or transmit any content you enter into our
                tools. All tool processing (JSON formatting, regex matching, JWT decoding, etc.) runs
                entirely in your browser using JavaScript. We have no backend server and no database.
              </p>
            </div>

            <AdSlot variant="banner" className="my-2" />

            <div>
              <h2 className="text-lg font-semibold mb-2">Analytics</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use Google Analytics 4 to collect anonymized usage statistics such as page views
                and tool usage frequency. No personal information or tool content is collected. You
                can opt out via browser privacy settings or ad blockers.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Advertising</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We display ads via Google AdSense. Google may use cookies to serve relevant ads based
                on your browsing history. See Google&apos;s privacy policy for details on how ad data
                is handled. You can opt out via Google&apos;s ad settings.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">localStorage</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Some tools (like the Smart Checklist) save your work to your browser&apos;s
                localStorage automatically. This data stays entirely on your device and is never
                transmitted to any server. You can clear it at any time via your browser settings.
              </p>
            </div>

            <AdSlot variant="banner" className="my-2" />

            <div>
              <h2 className="text-lg font-semibold mb-2">Cookies</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We do not set cookies directly. Google AdSense and Google Analytics may set cookies
                on your browser for ad personalization and analytics purposes.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For privacy questions, please contact us via our public GitHub repository or the
                contact details on the About page.
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
