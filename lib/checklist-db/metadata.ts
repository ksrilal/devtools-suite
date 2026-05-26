import { getDB } from './db'
import type { WorkspaceMetadata } from './types'

export type SortOrder = 'updated' | 'created' | 'alpha' | 'pinned'

export async function getAllMetadata(sort: SortOrder = 'updated'): Promise<WorkspaceMetadata[]> {
  try {
    const db = await getDB()
    const all = await db.getAll('metadata')

    return all.sort((a, b) => {
      if (sort === 'pinned') {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.updatedAt - a.updatedAt
      }
      if (sort === 'updated') return b.updatedAt - a.updatedAt
      if (sort === 'created') return b.createdAt - a.createdAt
      if (sort === 'alpha') return a.title.localeCompare(b.title)
      return b.updatedAt - a.updatedAt
    })
  } catch {
    return []
  }
}

export async function getMetadata(id: string): Promise<WorkspaceMetadata | null> {
  try {
    const db = await getDB()
    return (await db.get('metadata', id)) ?? null
  } catch {
    return null
  }
}

export async function updateMetadataPin(id: string, pinned: boolean): Promise<void> {
  const db = await getDB()
  const existing = await db.get('metadata', id)
  if (!existing) return
  await db.put('metadata', { ...existing, pinned })
}

export function filterMetadata(
  items: WorkspaceMetadata[],
  query: string,
): WorkspaceMetadata[] {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter((m) => m.title.toLowerCase().includes(q))
}
