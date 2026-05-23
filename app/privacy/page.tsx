import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = toolMetadata({
  title: 'Privacy Policy – DevTools Suite',
  description: 'DevTools Suite privacy policy. All tools run locally. No data is collected or transmitted.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().getFullYear()}</p>
      <div className="prose dark:prose-invert space-y-4">
        <h2>What data we collect</h2>
        <p>
          DevTools Suite does not collect, store, or transmit any content you enter into our tools.
          All tool processing (JSON formatting, regex matching, JWT decoding, etc.) runs entirely
          in your browser using JavaScript.
        </p>
        <h2>Analytics</h2>
        <p>
          We use Google Analytics 4 to collect anonymized usage statistics (page views, tool usage
          frequency). No personal information or tool content is collected. You can opt out via
          browser privacy settings or ad blockers.
        </p>
        <h2>Advertising</h2>
        <p>
          We display ads via Google AdSense. Google may use cookies to serve relevant ads. See
          Google&apos;s privacy policy for details on how ad data is handled.
        </p>
        <h2>localStorage</h2>
        <p>
          Some tools (like the Smart Checklist) save your work to your browser&apos;s localStorage.
          This data stays on your device and is never transmitted anywhere.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy questions, please open an issue in our public repository.
        </p>
      </div>
    </div>
  )
}
