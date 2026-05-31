export type { ChecklistTemplate, TemplateCategory, TemplateMode } from './types'
export { CATEGORY_LABELS } from './types'
export { engineeringTemplates } from './engineering'
export { devopsTemplates } from './devops'
export { securityTemplates } from './security'
export { qaTemplates } from './qa'
export { planningTemplates } from './planning'
export { productivityTemplates } from './productivity'
export { startupTemplates } from './startup'
export { marketingTemplates } from './marketing'
export { aiTemplates } from './ai'
export { operationsTemplates } from './operations'
export { businessTemplates } from './business'
export { remoteTemplates } from './remote'
export { contentTemplates } from './content'
export { healthTemplates } from './health'
export { studyTemplates } from './study'
export { personalTemplates } from './personal'

import { engineeringTemplates } from './engineering'
import { devopsTemplates } from './devops'
import { securityTemplates } from './security'
import { qaTemplates } from './qa'
import { planningTemplates } from './planning'
import { productivityTemplates } from './productivity'
import { startupTemplates } from './startup'
import { marketingTemplates } from './marketing'
import { aiTemplates } from './ai'
import { operationsTemplates } from './operations'
import { businessTemplates } from './business'
import { remoteTemplates } from './remote'
import { contentTemplates } from './content'
import { healthTemplates } from './health'
import { studyTemplates } from './study'
import { personalTemplates } from './personal'
import type { ChecklistTemplate, TemplateCategory } from './types'

export const allTemplates: ChecklistTemplate[] = [
  ...engineeringTemplates,
  ...devopsTemplates,
  ...securityTemplates,
  ...qaTemplates,
  ...planningTemplates,
  ...productivityTemplates,
  ...startupTemplates,
  ...marketingTemplates,
  ...aiTemplates,
  ...operationsTemplates,
  ...businessTemplates,
  ...remoteTemplates,
  ...contentTemplates,
  ...healthTemplates,
  ...studyTemplates,
  ...personalTemplates,
]

export const featuredTemplates = allTemplates.filter((t) => t.featured)

export function getTemplatesByCategory(category: TemplateCategory): ChecklistTemplate[] {
  return allTemplates.filter((t) => t.category === category)
}

export function searchTemplates(query: string): ChecklistTemplate[] {
  if (!query.trim()) return allTemplates
  const q = query.toLowerCase()
  return allTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)),
  )
}
