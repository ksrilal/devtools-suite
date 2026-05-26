import type { ChecklistItem } from '@/lib/tools/checklist'
import type { AdvancedItem } from '@/lib/tools/checklist-advanced'

export type ChecklistMode = 'simple' | 'advanced'

export interface WorkspaceMetadata {
  id: string
  title: string
  mode: ChecklistMode
  createdAt: number
  updatedAt: number
  itemCount: number
  checkedCount: number
  pinned: boolean
  templateId?: string
}

export interface Workspace {
  id: string
  title: string
  mode: ChecklistMode
  createdAt: number
  updatedAt: number
  items: ChecklistItem[] | AdvancedItem[]
  schemaVersion: number
}

export type WorkspaceItems = ChecklistItem[] | AdvancedItem[]
