import type { ChecklistItem } from '@/lib/tools/checklist'
import type { AdvancedItem } from '@/lib/tools/checklist-advanced'

export type TemplateCategory =
  | 'engineering'
  | 'devops'
  | 'security'
  | 'qa'
  | 'planning'
  | 'productivity'
  | 'startup'
  | 'marketing'
  | 'ai'
  | 'operations'
  | 'business'
  | 'remote'
  | 'content'
  | 'health'
  | 'study'
  | 'personal'

export type TemplateMode = 'simple' | 'advanced'

export interface ChecklistTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  mode: TemplateMode
  tags: string[]
  featured: boolean
  previewLines: string[]
  items: ChecklistItem[] | AdvancedItem[]
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  engineering: 'Engineering',
  devops: 'DevOps',
  security: 'Security',
  qa: 'QA & Testing',
  planning: 'Planning',
  productivity: 'Productivity',
  startup: 'Startup',
  marketing: 'Marketing',
  ai: 'AI',
  operations: 'Operations',
  business: 'Business',
  remote: 'Remote Work',
  content: 'Content Creation',
  health: 'Health & Lifestyle',
  study: 'Study & Education',
  personal: 'Personal',
}
