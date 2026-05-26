'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLastActiveWorkspaceId } from '@/lib/checklist-db'

export function ChecklistRedirect() {
  const router = useRouter()

  useEffect(() => {
    const lastId = getLastActiveWorkspaceId()
    if (lastId) {
      // Verify the workspace still exists before redirecting
      import('@/lib/checklist-db').then(({ getWorkspace }) =>
        getWorkspace(lastId).then((ws) => {
          if (ws) {
            router.replace(`/checklist/${lastId}`)
          } else {
            router.replace('/checklist/workspace')
          }
        })
      )
    } else {
      router.replace('/checklist/workspace')
    }
  }, [router])

  return (
    <div className="container py-12 flex items-center justify-center">
      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}
