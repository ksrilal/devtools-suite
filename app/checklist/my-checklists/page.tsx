import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'
import { MyChecklistsPageClient } from '@/components/checklist/my-checklists-page-client'

export const metadata: Metadata = toolMetadata({
  title: 'My Checklists – Smart Checklist',
  description: 'All your saved checklists, stored locally in your browser. Rename, duplicate, or delete workspaces.',
  path: '/checklist/my-checklists',
})

export default function MyChecklistsPage() {
  return <MyChecklistsPageClient />
}
