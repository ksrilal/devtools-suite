import type { Workspace } from './types'

export const CURRENT_SCHEMA_VERSION = 1

type RawWorkspace = Record<string, unknown>

const migrations: Record<number, (raw: RawWorkspace) => RawWorkspace> = {
  1: (raw) => raw, // baseline — all v1 documents pass through unchanged
}

export function migrateWorkspace(raw: unknown): Workspace {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid workspace document')
  }

  let doc = raw as RawWorkspace
  const fromVersion = typeof doc['schemaVersion'] === 'number' ? (doc['schemaVersion'] as number) : 0

  for (let v = fromVersion; v < CURRENT_SCHEMA_VERSION; v++) {
    const migrateFn = migrations[v + 1]
    if (migrateFn) doc = migrateFn(doc)
  }

  return { ...(doc as unknown as Workspace), schemaVersion: CURRENT_SCHEMA_VERSION }
}
