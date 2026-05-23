import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = toolMetadata({
  title: 'About DevTools Suite',
  description:
    'DevTools Suite is a free, privacy-first collection of browser-based developer tools. No login, no backend, no data collection.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">About DevTools Suite</h1>
      <div className="prose dark:prose-invert">
        <p>
          DevTools Suite is a free, privacy-first collection of developer tools that run entirely
          in your browser. No login required. No data sent to servers. No tracking of your content.
        </p>
        <h2>Our philosophy</h2>
        <ul>
          <li>
            <strong>Privacy first</strong> — all processing happens locally. Your code, tokens,
            and data never leave your device.
          </li>
          <li>
            <strong>Zero friction</strong> — open a tool and start using it immediately. No
            accounts, no onboarding, no paywalls.
          </li>
          <li>
            <strong>Fast</strong> — lightweight, static pages optimized for instant load times and
            smooth interactions.
          </li>
          <li>
            <strong>Accessible</strong> — keyboard navigation, screen reader support, and
            dark/light mode across all tools.
          </li>
        </ul>
        <h2>Tools available</h2>
        <ul>
          <li>Smart Checklist — convert any list to an interactive checklist</li>
          <li>JSON Formatter — prettify, minify, validate and explore JSON</li>
          <li>Cron Generator — build and test cron expressions visually</li>
          <li>Diff Checker — compare texts side by side</li>
          <li>JWT Decoder — inspect JWT tokens and claims</li>
          <li>Regex Tester — test regular expressions with live highlighting</li>
        </ul>
      </div>
    </div>
  )
}
