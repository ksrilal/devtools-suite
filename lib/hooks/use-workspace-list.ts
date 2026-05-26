'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getAllMetadata,
  deleteWorkspace,
  duplicateWorkspace,
  togglePinWorkspace,
  updateWorkspaceTitle,
  type WorkspaceMetadata,
  type SortOrder,
} from '@/lib/checklist-db'

interface UseWorkspaceListReturn {
  items: WorkspaceMetadata[]
  loading: boolean
  refresh: () => Promise<void>
  remove: (id: string) => Promise<void>
  duplicate: (id: string) => Promise<string | null>
  rename: (id: string, title: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  sort: SortOrder
  setSort: (s: SortOrder) => void
}

const SORT_STORAGE_KEY = 'devtools_checklist_sort_order'

function getSavedSort(): SortOrder {
  try {
    const saved = localStorage.getItem(SORT_STORAGE_KEY)
    if (saved === 'updated' || saved === 'created' || saved === 'alpha' || saved === 'pinned') return saved
  } catch { /* ignore */ }
  return 'updated'
}

export function useWorkspaceList(): UseWorkspaceListReturn {
  const [items, setItems] = useState<WorkspaceMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortOrder>(getSavedSort)

  const persistSort = useCallback((s: SortOrder) => {
    try { localStorage.setItem(SORT_STORAGE_KEY, s) } catch { /* ignore */ }
    setSort(s)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getAllMetadata(sort)
    setItems(data)
    setLoading(false)
  }, [sort])

  useEffect(() => { void load() }, [load])

  const remove = useCallback(async (id: string) => {
    await deleteWorkspace(id)
    setItems((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const duplicate = useCallback(async (id: string): Promise<string | null> => {
    const ws = await duplicateWorkspace(id)
    if (!ws) return null
    await load()
    return ws.id
  }, [load])

  const rename = useCallback(async (id: string, title: string) => {
    await updateWorkspaceTitle(id, title)
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, title } : m))
  }, [])

  const togglePin = useCallback(async (id: string) => {
    await togglePinWorkspace(id)
    if (sort === 'pinned') {
      // Re-sort so pinned items jump to the top immediately
      await load()
    } else {
      setItems((prev) => prev.map((m) => m.id === id ? { ...m, pinned: !m.pinned } : m))
    }
  }, [sort, load])

  return { items, loading, refresh: load, remove, duplicate, rename, togglePin, sort, setSort: persistSort }
}
