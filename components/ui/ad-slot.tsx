'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type AdSlotVariant = 'banner' | 'sidebar' | 'sidebar-large' | 'sidebar-wide' | 'in-content'

interface AdSlotProps {
  variant: AdSlotVariant
  className?: string
}

const slotDimensions: Record<AdSlotVariant, string> = {
  banner: 'min-h-[90px] w-full',
  sidebar: 'min-h-[250px] w-full',
  'sidebar-large': 'min-h-[600px] w-full',
  'sidebar-wide': 'min-h-[250px] w-full',
  'in-content': 'min-h-[250px] w-full',
}

const slotLabels: Record<AdSlotVariant, string> = {
  banner: 'Banner Ad · 728×90',
  sidebar: 'Sidebar Ad · 300×250',
  'sidebar-large': 'Sidebar Ad · 300×600',
  'sidebar-wide': 'Sidebar Ad · 600×250',
  'in-content': 'In-content Ad · 300×250',
}

const isDev = process.env.NODE_ENV === 'development'

export function AdSlot({ variant, className }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const insRef = useRef<HTMLModElement>(null)
  const [filled, setFilled] = useState(false)
  const clientId = process.env['NEXT_PUBLIC_ADSENSE_CLIENT_ID']

  useEffect(() => {
    if (!clientId || !insRef.current) return

    // Push ad
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle as unknown[]).push({})
    } catch {
      // Ad block or init failure
    }

    // Watch for AdSense filling the <ins> — it sets data-ad-status="filled"
    const ins = insRef.current
    const observer = new MutationObserver(() => {
      const status = ins.getAttribute('data-ad-status')
      if (status === 'filled') {
        setFilled(true)
        observer.disconnect()
      } else if (status === 'unfilled') {
        // AdSense explicitly said no ad — stay collapsed
        observer.disconnect()
      }
    })

    observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status', 'style'] })

    // Fallback: also check height after a short delay
    const t = setTimeout(() => {
      const h = ins.offsetHeight
      if (h > 0) setFilled(true)
      observer.disconnect()
    }, 3000)

    return () => {
      observer.disconnect()
      clearTimeout(t)
    }
  }, [clientId])

  // No AdSense key
  if (!clientId) {
    if (!isDev) return null
    return (
      <div
        className={cn(
          slotDimensions[variant],
          'flex items-center justify-center rounded-md border border-dashed border-blue-400/50 bg-blue-500/5 text-xs text-blue-400/70 font-mono',
          className
        )}
        aria-hidden="true"
      >
        {slotLabels[variant]}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        // Collapse completely when not filled — no height, no margin, no padding
        filled ? slotDimensions[variant] : 'h-0 overflow-hidden',
        'transition-none',
        className
      )}
      aria-label={filled ? 'Advertisement' : undefined}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
