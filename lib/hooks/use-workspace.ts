'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getWorkspace,
  saveWorkspace,
  setLastActiveWorkspaceId,
  type Workspace,
} from '@/lib/checklist-db'
import type { WorkspaceItems } from '@/lib/checklist-db'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseWorkspaceReturn {
  workspace: Workspace | null
  loading: boolean
  saveStatus: SaveStatus
  updateItems: (items: WorkspaceItems) => void
  updateTitle: (title: string) => void
}

export function useWorkspace(id: string): UseWorkspaceReturn {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const pendingRef = useRef<Workspace | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load workspace from IndexedDB on mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getWorkspace(id).then((ws) => {
      if (!cancelled) {
        setWorkspace(ws)
        setLoading(false)
        if (ws) setLastActiveWorkspaceId(ws.id)
      }
    })
    return () => { cancelled = true }
  }, [id])

  // Debounced persist function
  const scheduleSave = useCallback((updated: Workspace) => {
    pendingRef.current = updated
    setSaveStatus('saving')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const toSave = pendingRef.current
      if (!toSave) return
      try {
        await saveWorkspace(toSave)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {
        setSaveStatus('error')
      }
      pendingRef.current = null
    }, 800)
  }, [])

  // Flush on page unload
  useEffect(() => {
    const flush = () => {
      if (!pendingRef.current) return
      if (timerRef.current) clearTimeout(timerRef.current)
      // synchronous IndexedDB isn't possible, but we can try — navigator.sendBeacon
      // or just let the next load restore. For now fire-and-forget.
      saveWorkspace(pendingRef.current).catch(() => {})
    }
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [])

  const updateItems = useCallback((items: WorkspaceItems) => {
    setWorkspace((prev) => {
      if (!prev) return prev
      const updated = { ...prev, items, updatedAt: Date.now() }
      scheduleSave(updated)
      return updated
    })
  }, [scheduleSave])

  const updateTitle = useCallback((title: string) => {
    setWorkspace((prev) => {
      if (!prev) return prev
      const updated = { ...prev, title, updatedAt: Date.now() }
      scheduleSave(updated)
      return updated
    })
  }, [scheduleSave])

  return { workspace, loading, saveStatus, updateItems, updateTitle }
}
