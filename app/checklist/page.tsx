import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'
import { ChecklistRedirect } from '@/components/checklist/checklist-redirect'

export const metadata: Metadata = toolMetadata({
  title: 'Smart Checklist Tool – Free Online Checklist Maker',
  description:
    'Free online checklist tool with nested tasks, drag-and-drop, progress tracking, PDF export, and shareable URLs. No login required.',
  path: '/checklist',
  keywords: [
    'online checklist tool',
    'checklist maker',
    'developer checklist',
    'release checklist',
    'QA checklist tool',
  ],
})

export default function ChecklistPage() {
  return <ChecklistRedirect />
}
