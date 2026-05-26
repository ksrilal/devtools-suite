import { getDB } from './db'
import { migrateWorkspace, CURRENT_SCHEMA_VERSION } from './migrations'
import type { Workspace, WorkspaceMetadata, WorkspaceItems, ChecklistMode } from './types'
import type { ChecklistItem } from '@/lib/tools/checklist'
import type { AdvancedItem } from '@/lib/tools/checklist-advanced'

function generateId(): string {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

function deriveMetadata(workspace: Workspace, pinned = false): WorkspaceMetadata {
  const items = workspace.items
  let itemCount = 0
  let checkedCount = 0

  if (workspace.mode === 'simple') {
    const simpleItems = items as ChecklistItem[]
    itemCount = simpleItems.length
    checkedCount = simpleItems.filter((i) => i.state === 'checked').length
  } else {
    const advItems = items as AdvancedItem[]
    const leafItems = advItems.filter((i) => {
      if (i.depth === 2) return true
      return !advItems.some((child) => child.parentId === i.id)
    })
    itemCount = leafItems.length || advItems.length
    // Count only leaf items so checkedCount never exceeds itemCount
    const leafSet = new Set(leafItems.map((i) => i.id))
    checkedCount = advItems.filter((i) => leafSet.has(i.id) && i.state === 'checked').length
  }

  return {
    id: workspace.id,
    title: workspace.title,
    mode: workspace.mode,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
    itemCount,
    checkedCount,
    pinned,
  }
}

export async function createWorkspace(
  title: string,
  mode: ChecklistMode,
  items: WorkspaceItems = [],
  templateId?: string,
): Promise<Workspace> {
  const now = Date.now()
  const workspace: Workspace = {
    id: generateId(),
    title,
    mode,
    createdAt: now,
    updatedAt: now,
    items,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  }

  const db = await getDB()
  const tx = db.transaction(['workspaces', 'metadata'], 'readwrite')
  await Promise.all([
    tx.objectStore('workspaces').put(workspace),
    tx.objectStore('metadata').put({
      ...deriveMetadata(workspace),
      pinned: false,
      templateId,
    }),
    tx.done,
  ])

  return workspace
}

export async function getWorkspace(id: string): Promise<Workspace | null> {
  try {
    const db = await getDB()
    const raw = await db.get('workspaces', id)
    if (!raw) return null
    return migrateWorkspace(raw)
  } catch {
    return null
  }
}

export async function saveWorkspace(workspace: Workspace): Promise<void> {
  const updated = { ...workspace, updatedAt: Date.now() }
  const db = await getDB()
  const tx = db.transaction(['workspaces', 'metadata'], 'readwrite')
  const existingMeta = await tx.objectStore('metadata').get(workspace.id) as WorkspaceMetadata | undefined
  await Promise.all([
    tx.objectStore('workspaces').put(updated),
    tx.objectStore('metadata').put(deriveMetadata(updated, existingMeta?.pinned ?? false)),
    tx.done,
  ])
}

export async function updateWorkspaceTitle(id: string, title: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['workspaces', 'metadata'], 'readwrite')
  const workspace = await tx.objectStore('workspaces').get(id) as Workspace | undefined
  if (!workspace) { await tx.done; return }
  const existingMeta = await tx.objectStore('metadata').get(id) as WorkspaceMetadata | undefined
  const updated = { ...workspace, title, updatedAt: Date.now() }
  await Promise.all([
    tx.objectStore('workspaces').put(updated),
    tx.objectStore('metadata').put(deriveMetadata(updated, existingMeta?.pinned ?? false)),
    tx.done,
  ])
}

export async function deleteWorkspace(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['workspaces', 'metadata'], 'readwrite')
  await Promise.all([
    tx.objectStore('workspaces').delete(id),
    tx.objectStore('metadata').delete(id),
    tx.done,
  ])
}

export async function duplicateWorkspace(id: string): Promise<Workspace | null> {
  const original = await getWorkspace(id)
  if (!original) return null
  return createWorkspace(`Copy of ${original.title}`, original.mode, original.items)
}

export async function togglePinWorkspace(id: string): Promise<void> {
  const db = await getDB()
  const meta = await db.get('metadata', id)
  if (!meta) return
  await db.put('metadata', { ...meta, pinned: !meta.pinned })
}

// Store last active workspace id in localStorage (tiny, no need for IndexedDB)
const LAST_ACTIVE_KEY = 'devtools_checklist_last_workspace'

export function getLastActiveWorkspaceId(): string | null {
  try {
    return localStorage.getItem(LAST_ACTIVE_KEY)
  } catch {
    return null
  }
}

export function setLastActiveWorkspaceId(id: string): void {
  try {
    localStorage.setItem(LAST_ACTIVE_KEY, id)
  } catch {
    // ignore
  }
}

export function clearLastActiveWorkspaceId(): void {
  try {
    localStorage.removeItem(LAST_ACTIVE_KEY)
  } catch {
    // ignore
  }
}
