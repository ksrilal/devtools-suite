'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

const tools = [
  { href: '/checklist',            label: 'Checklist', title: 'Smart Checklist' },
  { href: '/json-formatter',       label: 'JSON',      title: 'JSON Formatter' },
  { href: '/cron-generator',       label: 'Cron',      title: 'Cron Generator' },
  { href: '/diff-checker',         label: 'Diff',      title: 'Diff Checker' },
  { href: '/jwt-decoder',          label: 'JWT',       title: 'JWT Decoder' },
  { href: '/regex-tester',         label: 'Regex',     title: 'Regex Tester' },
  { href: '/base64-encoder-decoder', label: 'Base64',  title: 'Base64 Encoder / Decoder' },
  { href: '/uuid-generator',       label: 'UUID',      title: 'UUID Generator' },
  { href: '/url-encoder-decoder',  label: 'URL',       title: 'URL Encoder / Decoder' },
  { href: '/markdown-previewer',   label: 'Markdown',  title: 'Markdown Previewer' },
  { href: '/sql-formatter',        label: 'SQL',       title: 'SQL Formatter' },
  { href: '/color-converter',      label: 'Color',     title: 'Color Converter' },
  { href: '/hash-generator',       label: 'Hash',      title: 'Hash Generator' },
  { href: '/yaml-json-converter',  label: 'YAML',      title: 'YAML ↔ JSON Converter' },
]

export function Nav() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-2">
        <Link
          href="/"
          className="mr-4 flex items-center gap-2 font-semibold shrink-0 hover:opacity-80 transition-opacity"
        >
          <Image src="/logo.png" alt="" width={32} height={32} className="rounded-lg object-cover shrink-0" />
          <span className="hidden sm:inline">DevTools Suite</span>
          <span className="sm:hidden">DevTools</span>
        </Link>

        <Tooltip.Provider delayDuration={400}>
          <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Main navigation">
            {tools.map((t) => (
              <Tooltip.Root key={t.href}>
                <Tooltip.Trigger asChild>
                  <Link
                    href={t.href}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-md transition-colors',
                      pathname === t.href
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                    )}
                  >
                    {t.label}
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={6}
                    className="z-50 rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                  >
                    {t.title}
                    <Tooltip.Arrow className="fill-foreground" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </nav>
        </Tooltip.Provider>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-md hover:bg-accent transition-colors w-8 h-8 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors w-8 h-8 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border/50" aria-label="Mobile navigation">
          <div className="container py-3 grid grid-cols-2 gap-1">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-colors',
                  pathname === t.href
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
