import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'
import { AdSlot } from '@/components/ui/ad-slot'
import { ContactCards } from './contact-cards'
import { MessageSquare } from 'lucide-react'

export const metadata: Metadata = toolMetadata({
  title: 'Contact',
  description: 'Contact DevTools Suite for feedback, bug reports, feature requests, and open source contributions.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="flex gap-8">

        {/* Left: content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Contact</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Have feedback, bug reports, feature requests, or ideas? Feel free to reach out.
          </p>

          <ContactCards />

          <AdSlot variant="banner" className="mb-8" />

          <div className="rounded-lg border border-border/50 bg-muted/20 p-5">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevTools Suite is a privacy-first browser-based toolkit built for developers.
                Feedback, ideas, and open-source contributions are always welcome.
              </p>
            </div>
          </div>
        </div>

        {/* Right: sidebar ads */}
        <aside className="hidden xl:block w-[300px] 2xl:w-[600px] shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <AdSlot variant="sidebar-wide" />
            <AdSlot variant="sidebar" />
          </div>
        </aside>

      </div>
    </div>
  )
}
