"use client"

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ChevronRight, X, ExternalLink } from 'lucide-react'

const STORAGE_KEY = 'dailyplanly_promo_dismissed_until'

function Logo({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="64" height="64" rx="12" fill="#1e1b4b" />
      <path d="M16 40 L28 24 L38 34 L48 20" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DailyPlanlyWidget(): JSX.Element | null {
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [topOffset, setTopOffset] = useState<number | null>(null)
  // panelHeight removed; keep minimal state
  const [showPill, setShowPill] = useState(true)
  const [pillAnimatingOut, setPillAnimatingOut] = useState(false)
  const [panelMounted, setPanelMounted] = useState(false)
  const [panelAnimatingOut, setPanelAnimatingOut] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const until = Number(raw)
        if (!Number.isNaN(until) && Date.now() < until) {
          setVisible(false)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  // Measure header bottom to place widget just below header
  useEffect(() => {
    function measure() {
      try {
        const header = document.querySelector('header')
        const gap = 12
        if (header) {
          const rect = header.getBoundingClientRect()
          // fixed elements are positioned relative to the viewport — use rect.bottom
          setTopOffset(Math.round(rect.bottom + gap))
        } else {
          setTopOffset(64)
        }
      } catch (e) {
        setTopOffset(64)
      }
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!panelRef.current) return
      const target = e.target as Node
      if (panelRef.current && !panelRef.current.contains(target)) {
        closePanel()
      }
    }

    if (panelMounted) {
      document.addEventListener('mousedown', onDown)
    }
    return () => document.removeEventListener('mousedown', onDown)
  }, [panelMounted])

  // panel height measurement removed (not needed) - keep placeholder state for future use

  const OPEN_CLOSE_DURATION = 260

  function openPanel() {
    setPillAnimatingOut(true)
    setTimeout(() => {
      setShowPill(false)
      setPillAnimatingOut(false)
      setPanelMounted(true)
      // animate panel in
      setTimeout(() => setExpanded(true), 20)
    }, OPEN_CLOSE_DURATION)
  }

  function closePanel() {
    // start panel closing animation
    setExpanded(false)
    setPanelAnimatingOut(true)
    setTimeout(() => {
      setPanelMounted(false)
      setPanelAnimatingOut(false)
      setShowPill(true)
    }, OPEN_CLOSE_DURATION)
  }

  const dismissFor24h = () => {
    try {
      const until = Date.now() + 24 * 60 * 60 * 1000
      localStorage.setItem(STORAGE_KEY, String(until))
    } catch (e) {
      // ignore
    }
    setVisible(false)
  }

  if (!mounted) return null
  if (!visible) return null

  const content = (
    <div className="fixed z-50 pointer-events-none" style={topOffset ? { top: topOffset, right: 16 } : { right: 16 }}>
      <div className="relative pointer-events-auto" style={{ width: 320 }}>
        {/* Panel positioned to the left of the pill so it doesn't overlap */}
        {panelMounted && (
          <div
            ref={panelRef}
            className="absolute transition-all duration-300 ease-in-out transform"
            style={{
              width: 280,
              right: 64,
              opacity: expanded ? 1 : 0,
              transform: expanded ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
              pointerEvents: expanded ? 'auto' : 'none',
            }}
            data-expanded={expanded}
            data-panel-animating={panelAnimatingOut}
          >
            <div className="w-72 rounded-2xl backdrop-blur-md bg-gradient-to-br from-[#1e1b4b]/95 via-[#6d28d9]/80 to-[#a855f7]/40 border border-purple-600/20 shadow-[0_16px_40px_rgba(168,85,247,0.22)] ring-1 ring-purple-400/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-[#2b235a] to-[#5b21b6] p-1 overflow-hidden">
                  <img src="/dailyplanly.png" alt="DailyPlanly" className="h-7 w-7 object-cover block" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#e9d5ff]">DailyPlanly</div>
                  <div className="text-[11px] text-purple-200/70">dailyplanly.com</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Close panel"
                  onClick={() => closePanel()}
                  className="p-1 rounded-md hover:bg-white/5"
                >
                  <X className="w-4 h-4 text-purple-100/90" />
                </button>
              </div>
            </div>

            <div className="px-4 pb-4">
              <h3 className="text-lg font-semibold text-white">Plan better. Achieve more.</h3>
              <p className="mt-2 text-sm text-purple-100/80">DailyPlanly helps you organize your life with powerful planners, checklists, routines, habit trackers, and goal-focused productivity templates.</p>
              <p className="mt-2 text-xs text-purple-200/70">Whether you are improving your health, finances, studies, career, or daily routines, DailyPlanly provides ready-to-use systems to help you stay consistent and productive.</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Daily Planner',
                  'Smart Checklists',
                  'Habit Tracker',
                  'Goal Planning',
                  'Routines',
                  'Productivity Templates',
                ].map((f) => (
                  <span key={f} className="text-[12px] px-2 py-1 rounded-full bg-white/5 text-purple-100/90 border border-purple-600/20">
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href="https://dailyplanly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white text-sm font-medium shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  Explore DailyPlanly <ExternalLink className="w-4 h-4" />
                </Link>

                <button
                  onClick={dismissFor24h}
                  className="ml-auto text-sm text-purple-200/80 hover:text-white px-2 py-1 rounded-md"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Collapsed vertical tab (purple DevTools-style pill) */}
        {(showPill || pillAnimatingOut) && (
          <button
            onClick={() => openPanel()}
            aria-label="Open DailyPlanly panel"
            className="absolute right-0 flex flex-col items-center justify-between py-4 h-36 w-16 rounded-full bg-gradient-to-b from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] shadow-[0_14px_40px_rgba(124,58,237,0.22)] border border-purple-600/40 transition-all duration-300 z-50 pointer-events-auto"
            style={{
              top: 0,
              opacity: pillAnimatingOut ? 0 : 1,
              transform: pillAnimatingOut ? 'scale(0.95)' : 'scale(1)',
            }}
            data-expanded={expanded}
            data-pill-animating={pillAnimatingOut}
          >
            {/* Decorative glow effect */}
            <div
              className="absolute pointer-events-none opacity-10 blur-lg"
              style={{
                left: -20,
                top: '50%',
                width: 24,
                height: 80,
                transform: 'translateY(-50%)',
                borderRadius: 9999,
                background: 'linear-gradient(180deg, #7c3aed, #a855f7)',
              }}
            />

            {/* Top: Logo */}
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-white/6 ring-1 ring-white/6 p-2 flex items-center justify-center overflow-hidden">
                <div className="rounded-full bg-white/10 p-1 flex items-center justify-center">
                  <img
                    src="/dailyplanly.png"
                    alt="DailyPlanly"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Middle: Rotated label */}
            <div className="flex items-center justify-center flex-1">
              <div className="text-white text-xs font-semibold tracking-wider whitespace-nowrap drop-shadow-md transform -rotate-90">
                DailyPlanly
              </div>
            </div>

            {/* Bottom: Chevron */}
            <div className="flex items-center justify-center text-white/90">
              <ChevronRight className="w-4 h-4 transform rotate-90" />
            </div>
          </button>
        )}
      </div>
    </div>
  )

  // Render into document.body so fixed positioning is relative to viewport (avoids transformed ancestors)
  if (typeof document !== 'undefined') {
    return createPortal(content, document.body)
  }
  return content
}
