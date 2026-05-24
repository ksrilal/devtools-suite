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
  const insRef = useRef<HTMLModElement>(null)
  const [filled, setFilled] = useState(false)
  const clientId = process.env['NEXT_PUBLIC_ADSENSE_CLIENT_ID']

  useEffect(() => {
    if (!clientId || !insRef.current) return

    // Push the ad request
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle as unknown[]).push({})
    } catch {
      return
    }

    const ins = insRef.current

    const check = (): boolean => {
      if (ins.getAttribute('data-ad-status') === 'filled') { setFilled(true); return true }
      if (ins.getAttribute('data-ad-status') === 'unfilled') return true
      if (ins.querySelector('iframe')) { setFilled(true); return true }
      return false
    }

    if (check()) return

    const observer = new MutationObserver(() => { if (check()) observer.disconnect() })
    observer.observe(ins, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['data-ad-status', 'style'],
    })

    const t = setTimeout(() => { observer.disconnect() }, 6000)
    return () => { observer.disconnect(); clearTimeout(t) }
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
      className={filled ? cn(slotDimensions[variant], className) : undefined}
      style={filled ? undefined : { display: 'none' }}
      aria-label={filled ? 'Advertisement' : undefined}
      aria-hidden={!filled || undefined}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
