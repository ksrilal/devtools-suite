'use client'

import { useState, useEffect } from 'react'
import { runLegacyMigration } from '@/lib/checklist-db/migrate-legacy'

export interface MigrationState {
  done: boolean
  workspacesCreated: number
  dismissed: boolean
  dismiss: () => void
}

export function useLegacyMigration(): MigrationState {
  const [workspacesCreated, setWorkspacesCreated] = useState(0)
  const [done, setDone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    runLegacyMigration().then((result) => {
      if (result.migrated && result.workspacesCreated > 0) {
        setWorkspacesCreated(result.workspacesCreated)
        setDone(true)
      }
    })
  }, [])

  return {
    done,
    workspacesCreated,
    dismissed,
    dismiss: () => setDismissed(true),
  }
}
