'use client'

import { useEffect, useRef } from 'react'
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
  const adRef = useRef<HTMLDivElement>(null)
  const clientId = process.env['NEXT_PUBLIC_ADSENSE_CLIENT_ID']

  useEffect(() => {
    if (!clientId || !adRef.current) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle as unknown[]).push({})
    } catch {
      // Ad block or init failure — fail silently
    }
  }, [clientId])

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
      ref={adRef}
      className={cn(slotDimensions[variant], 'overflow-hidden bg-muted/30', className)}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
