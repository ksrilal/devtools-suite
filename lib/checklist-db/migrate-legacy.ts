import { createWorkspace } from './workspaces'
import type { ChecklistMode } from './types'
import type { ChecklistItem } from '@/lib/tools/checklist'
import type { AdvancedItem } from '@/lib/tools/checklist-advanced'

const LEGACY_KEYS = {
  simpleItems: 'devtools_checklist_v1',
  simpleTitle: 'devtools_checklist_title',
  advItems: 'devtools_checklist_advanced_v1',
  advTitle: 'devtools_checklist_advanced_title',
  mode: 'devtools_checklist_mode',
} as const

const MIGRATION_DONE_KEY = 'devtools_checklist_migration_v1_done'
const BACKUP_KEY = 'devtools_checklist_legacy_backup'

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function hasLegacyData(): boolean {
  try {
    return (
      localStorage.getItem(LEGACY_KEYS.simpleItems) !== null ||
      localStorage.getItem(LEGACY_KEYS.advItems) !== null
    )
  } catch {
    return false
  }
}

function isMigrationDone(): boolean {
  try {
    return localStorage.getItem(MIGRATION_DONE_KEY) === '1'
  } catch {
    return false
  }
}

function markMigrationDone(): void {
  try {
    localStorage.setItem(MIGRATION_DONE_KEY, '1')
  } catch {
    // ignore
  }
}

function saveBackup(): void {
  try {
    const backup = {
      simpleItems: localStorage.getItem(LEGACY_KEYS.simpleItems),
      simpleTitle: localStorage.getItem(LEGACY_KEYS.simpleTitle),
      advItems: localStorage.getItem(LEGACY_KEYS.advItems),
      advTitle: localStorage.getItem(LEGACY_KEYS.advTitle),
      mode: localStorage.getItem(LEGACY_KEYS.mode),
      backedUpAt: Date.now(),
    }
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup))
  } catch {
    // ignore
  }
}

function removeLegacyKeys(): void {
  try {
    Object.values(LEGACY_KEYS).forEach((key) => localStorage.removeItem(key))
  } catch {
    // ignore
  }
}

export interface MigrationResult {
  migrated: boolean
  workspacesCreated: number
  error?: string
}

export async function runLegacyMigration(): Promise<MigrationResult> {
  // Skip if already done or nothing to migrate
  if (isMigrationDone()) return { migrated: false, workspacesCreated: 0 }
  if (!hasLegacyData()) {
    markMigrationDone()
    return { migrated: false, workspacesCreated: 0 }
  }

  try {
    saveBackup()

    const mode = readLocal<ChecklistMode>(LEGACY_KEYS.mode) ?? 'simple'
    let workspacesCreated = 0

    // Migrate simple items if present
    const simpleItems = readLocal<ChecklistItem[]>(LEGACY_KEYS.simpleItems)
    if (simpleItems && simpleItems.length > 0) {
      const simpleTitle = readLocal<string>(LEGACY_KEYS.simpleTitle) ?? 'My Checklist'
      await createWorkspace(simpleTitle, 'simple', simpleItems)
      workspacesCreated++
    }

    // Migrate advanced items if present (and distinct from simple)
    const advItems = readLocal<AdvancedItem[]>(LEGACY_KEYS.advItems)
    if (advItems && advItems.length > 0) {
      const advTitle = readLocal<string>(LEGACY_KEYS.advTitle) ?? 'My Checklist'
      // Only migrate advanced if it has content different from simple session
      // (users could have both populated from switching modes)
      if (workspacesCreated === 0 || mode === 'advanced') {
        await createWorkspace(advTitle, 'advanced', advItems)
        workspacesCreated++
      }
    }

    removeLegacyKeys()
    markMigrationDone()

    return { migrated: true, workspacesCreated }
  } catch (err) {
    return {
      migrated: false,
      workspacesCreated: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
