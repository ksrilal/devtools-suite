import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ToolLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  className?: string
  bare?: boolean
}

export function ToolLayout({ children, sidebar, className, bare }: ToolLayoutProps) {
  return (
    <div className={cn(bare ? 'py-0' : 'container py-6', className)}>
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">{children}</div>
        {sidebar && (
          <aside className="hidden lg:block w-72 shrink-0">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  )
}

interface ToolHeaderProps {
  title: string
  description?: string
  toolbar?: ReactNode
}

export function ToolHeader({ title, description, toolbar }: ToolHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {toolbar && <div className="flex items-center gap-2 flex-wrap">{toolbar}</div>}
      </div>
    </div>
  )
}

interface ToolSectionProps {
  label?: string
  children: ReactNode
  className?: string
}

export function ToolSection({ label, children, className }: ToolSectionProps) {
  return (
    <section className={cn('space-y-2', className)} aria-label={label}>
      {label && (
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
      )}
      {children}
    </section>
  )
}
