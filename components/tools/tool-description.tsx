import { cn } from '@/lib/utils'

interface ToolDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function ToolDescription({ children, className }: ToolDescriptionProps) {
  return (
    <section
      className={cn(
        'mt-12 border-t pt-8 prose prose-sm dark:prose-invert max-w-none',
        className
      )}
      aria-label="Tool description"
    >
      {children}
    </section>
  )
}
