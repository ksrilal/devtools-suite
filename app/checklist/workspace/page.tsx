import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'
import { WorkspacePageClient } from '@/components/checklist/workspace-page-client'

export const metadata: Metadata = toolMetadata({
  title: 'Smart Checklist – Workspace',
  description: 'Create, paste, or continue a checklist. Simple flat lists or advanced nested workflows — all saved locally in your browser.',
  path: '/checklist/workspace',
})

export default function WorkspacePage() {
  return <WorkspacePageClient />
}
