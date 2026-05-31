'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, X, ArrowRight } from 'lucide-react'
import { useLegacyMigration } from '@/lib/hooks/use-legacy-migration'

export function MigrationToast() {
  const { done, workspacesCreated, dismissed, dismiss } = useLegacyMigration()

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!done || dismissed) return
    const t = setTimeout(dismiss, 8000)
    return () => clearTimeout(t)
  }, [done, dismissed, dismiss])

  if (!done || dismissed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex items-start gap-3 rounded-xl border border-green-500/20 bg-card shadow-xl px-4 py-3 max-w-sm animate-in slide-in-from-bottom-2 duration-300"
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10">
        <CheckSquare className="h-4 w-4 text-green-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">Checklist data migrated</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {workspacesCreated === 1
            ? 'Your saved checklist was moved to My Checklists.'
            : `${workspacesCreated} saved checklists were moved to My Checklists.`}
        </p>
        <MigrationLink dismiss={dismiss} />
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 p-0.5 rounded text-muted-foreground/60 hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function MigrationLink({ dismiss }: { dismiss: () => void }) {
  const router = useRouter()
  return (
    <button
      onClick={() => { dismiss(); router.push('/checklist/my-checklists') }}
      className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
    >
      View My Checklists
      <ArrowRight className="h-3 w-3" />
    </button>
  )
}
