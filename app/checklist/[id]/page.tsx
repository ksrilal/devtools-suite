import type { Metadata } from 'next'
import { WorkspaceEditorClient } from '@/components/checklist/workspace-editor-client'

export const metadata: Metadata = {
  title: 'Checklist | DevTools Suite',
  description: 'Edit and manage your checklist workspace.',
  robots: { index: false, follow: false },
}

interface PageProps {
  params: { id: string }
}

export default function WorkspaceEditorPage({ params }: PageProps) {
  return <WorkspaceEditorClient id={params.id} />
}
