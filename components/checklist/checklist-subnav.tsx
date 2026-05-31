'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, LayoutTemplate, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MigrationToast } from './migration-toast'

const navItems = [
  { href: '/checklist/workspace', label: 'Workspace', icon: Plus },
  { href: '/checklist/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/checklist/my-checklists', label: 'My Checklists', icon: FolderOpen },
]

export function ChecklistSubnav({ count }: { count?: number }) {
  const pathname = usePathname()

  return (
    <>
    <MigrationToast />
    <div className="border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="container">
        <nav className="flex items-center gap-1 h-10" aria-label="Checklist navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href === '/checklist/workspace' && pathname === '/checklist')
            const showCount = href === '/checklist/my-checklists' && count !== undefined && count > 0
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors relative',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {label}
                {showCount && (
                  <span className="ml-0.5 text-[10px] tabular-nums text-muted-foreground/60">
                    ({count})
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
    </>
  )
}
