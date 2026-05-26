import type { Metadata } from 'next'
import { toolMetadata } from '@/lib/seo/metadata'
import { TemplatesPageClient } from '@/components/checklist/templates-page-client'

export const metadata: Metadata = toolMetadata({
  title: 'Checklist Templates – Smart Checklist',
  description: 'Browse ready-made checklist templates for engineering, DevOps, planning, QA, productivity, and personal use. Start from a template in one click.',
  path: '/checklist/templates',
})

export default function TemplatesPage() {
  return <TemplatesPageClient />
}
