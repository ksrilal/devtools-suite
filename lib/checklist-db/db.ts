import { openDB, type IDBPDatabase } from 'idb'
import type { Workspace, WorkspaceMetadata } from './types'

const DB_NAME = 'devtools-checklist'
const DB_VERSION = 1

export interface ChecklistDB {
  workspaces: {
    key: string
    value: Workspace
  }
  metadata: {
    key: string
    value: WorkspaceMetadata
    indexes: { 'by-updated': number; 'by-pinned': number }
  }
}

let dbPromise: Promise<IDBPDatabase<ChecklistDB>> | null = null

export function getDB(): Promise<IDBPDatabase<ChecklistDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ChecklistDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('workspaces')) {
          db.createObjectStore('workspaces', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('metadata')) {
          const meta = db.createObjectStore('metadata', { keyPath: 'id' })
          meta.createIndex('by-updated', 'updatedAt')
          meta.createIndex('by-pinned', 'pinned')
        }
      },
    })
  }
  return dbPromise
}
