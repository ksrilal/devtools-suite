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
  { href: '/checklist',              label: 'Checklist',  title: 'Smart Checklist' },
  { href: '/json-formatter',         label: 'JSON',       title: 'JSON Formatter' },
  { href: '/cron-generator',         label: 'Cron',       title: 'Cron Generator' },
  { href: '/diff-checker',           label: 'Diff',       title: 'Diff Checker' },
  { href: '/jwt-decoder',            label: 'JWT',        title: 'JWT Decoder' },
  { href: '/regex-tester',           label: 'Regex',      title: 'Regex Tester' },
  { href: '/base64-encoder-decoder', label: 'Base64',     title: 'Base64 Encoder / Decoder' },
  { href: '/uuid-generator',         label: 'UUID',       title: 'UUID Generator' },
  { href: '/url-encoder-decoder',    label: 'URL',        title: 'URL Encoder / Decoder' },
  { href: '/markdown-previewer',     label: 'Markdown',   title: 'Markdown Previewer' },
  { href: '/sql-formatter',          label: 'SQL',        title: 'SQL Formatter' },
  { href: '/color-converter',        label: 'Color',      title: 'Color Converter' },
  { href: '/hash-generator',         label: 'Hash',       title: 'Hash Generator' },
  { href: '/yaml-json-converter',    label: 'YAML',       title: 'YAML ↔ JSON Converter' },
  { href: '/json-ts-generator',      label: 'TS Gen',     title: 'JSON → TypeScript Generator' },
  { href: '/csv-json-converter',     label: 'CSV',        title: 'CSV ↔ JSON Converter' },
  { href: '/timestamp-converter',    label: 'Timestamp',  title: 'Unix Timestamp Converter' },
  { href: '/case-converter',         label: 'Case',       title: 'Case Converter' },
  { href: '/password-generator',     label: 'Password',   title: 'Password Generator' },
  { href: '/jwt-generator',          label: 'JWT Gen',    title: 'JWT Generator' },
  { href: '/xml-formatter',          label: 'XML',        title: 'XML Formatter' },
  { href: '/qr-code-generator',      label: 'QR Code',    title: 'QR Code Generator' },
  { href: '/json-zod-generator',     label: 'Zod',        title: 'JSON → Zod Schema Generator' },
  { href: '/flexbox-playground',     label: 'Flexbox',    title: 'Flexbox Playground' },
  { href: '/api-request-builder',    label: 'API',        title: 'API Request Builder' },
  { href: '/json-schema-generator',  label: 'JSON Schema',title: 'JSON Schema Generator' },
  { href: '/bcrypt-generator',       label: 'Bcrypt',     title: 'Bcrypt Generator' },
  { href: '/openapi-viewer',         label: 'OpenAPI',    title: 'OpenAPI Viewer' },
  { href: '/tailwind-playground',    label: 'Tailwind',   title: 'Tailwind Playground' },
  { href: '/json-to-dart',           label: 'Dart',       title: 'JSON → Dart Models' },
  { href: '/json-to-csharp',         label: 'C#',         title: 'JSON → C# Classes' },
  { href: '/docker-compose-formatter', label: 'Docker',   title: 'Docker Compose Formatter' },
]

// Split evenly; Phase 4 additions will auto-distribute
const mid = Math.ceil(tools.length / 2)
const row1 = tools.slice(0, mid)
const row2 = tools.slice(mid)

function NavLink({ t, pathname }: { t: typeof tools[number]; pathname: string }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Link
          href={t.href}
          className={cn(
            'px-2.5 py-1 rounded-md transition-all whitespace-nowrap leading-none',
            pathname === t.href
              ? 'bg-accent text-accent-foreground text-sm font-semibold'
              : 'text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/60'
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
  )
}

export function Nav() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      {/* ── Desktop nav ── */}
      <Tooltip.Provider delayDuration={400}>
        <div className="hidden md:flex items-stretch container">

          {/* Logo — vertically centered, left-pinned */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold shrink-0 pr-4 mr-2 border-r border-border/40 hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.png" alt="" width={30} height={30} className="rounded-lg object-cover shrink-0" />
            <span className="text-sm font-semibold">DevTools Suite</span>
          </Link>

          {/* Active tool — vertically centered like the logo, shown only when a tool is active */}
          {tools.some((t) => t.href === pathname) && (() => {
            const active = tools.find((t) => t.href === pathname)!
            return (
              <div className="flex items-center pr-3 mr-1 border-r border-border/40 shrink-0">
                <span className="text-sm font-semibold text-foreground bg-accent px-2.5 py-1 rounded-md whitespace-nowrap">
                  {active.label}
                </span>
              </div>
            )
          })()}

          {/* Two-row tool nav — inactive items only */}
          <nav className="flex-1 flex flex-col justify-center py-1.5 gap-0.5 min-w-0" aria-label="Main navigation">
            <div className="flex items-center justify-between">
              {row1.filter((t) => t.href !== pathname).map((t) => <NavLink key={t.href} t={t} pathname={pathname} />)}
            </div>
            <div className="flex items-center justify-between">
              {row2.filter((t) => t.href !== pathname).map((t) => <NavLink key={t.href} t={t} pathname={pathname} />)}
            </div>
          </nav>

          {/* Theme toggle — vertically centered, right-pinned */}
          <div className="flex items-center pl-2 ml-2 border-l border-border/40">
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-md hover:bg-accent transition-colors w-8 h-8 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          </div>
        </div>
      </Tooltip.Provider>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden flex h-12 items-center gap-2 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold shrink-0 hover:opacity-80 transition-opacity"
        >
          <Image src="/logo.png" alt="" width={28} height={28} className="rounded-lg object-cover shrink-0" />
          <span className="text-sm font-semibold">DevTools</span>
        </Link>

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
            className="p-2 rounded-md hover:bg-accent transition-colors w-8 h-8 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/50" aria-label="Mobile navigation">
          <div className="container py-3 grid grid-cols-3 gap-1">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-2 py-2 text-xs rounded-md transition-colors text-center',
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
