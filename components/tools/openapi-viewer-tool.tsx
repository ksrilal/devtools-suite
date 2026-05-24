'use client'

import { useState, useCallback, useMemo } from 'react'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OpenAPIInfo { title: string; version: string; description?: string }
interface OpenAPIServer { url: string; description?: string }
interface OpenAPIEndpoint {
  path: string
  method: string
  summary?: string
  description?: string
  tags?: string[]
  parameters?: Array<{ name: string; in: string; required?: boolean; description?: string; schema?: { type?: string } }>
  requestBody?: { description?: string; required?: boolean; content?: Record<string, { schema?: unknown }> }
  responses?: Record<string, { description?: string }>
  security?: Array<Record<string, string[]>>
}

interface ParsedSpec {
  info: OpenAPIInfo
  servers: OpenAPIServer[]
  endpoints: OpenAPIEndpoint[]
  securitySchemes: Record<string, { type: string; scheme?: string; description?: string }>
}

const METHOD_COLORS: Record<string, string> = {
  get:    'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30',
  post:   'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  put:    'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  patch:  'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
  delete: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  options:'bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30',
  head:   'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
}

function parseSpec(raw: unknown): ParsedSpec {
  const spec = raw as Record<string, unknown>
  const info = (spec['info'] ?? { title: 'API', version: '1.0' }) as OpenAPIInfo
  const servers = (spec['servers'] as OpenAPIServer[] | undefined) ?? []
  const securitySchemes = ((spec['components'] as Record<string, unknown> | undefined)?.['securitySchemes'] as Record<string, { type: string; scheme?: string; description?: string }> | undefined) ?? {}

  const paths = (spec['paths'] ?? {}) as Record<string, Record<string, unknown>>
  const endpoints: OpenAPIEndpoint[] = []

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)) {
        const operation = op as Record<string, unknown>
        const ep: OpenAPIEndpoint = { path, method }
        if (operation['summary'] !== undefined) ep.summary = operation['summary'] as string
        if (operation['description'] !== undefined) ep.description = operation['description'] as string
        if (operation['tags'] !== undefined) ep.tags = operation['tags'] as string[]
        type Params = Array<{ name: string; in: string; required?: boolean; description?: string; schema?: { type?: string } }>
        type ReqBody = { description?: string; required?: boolean; content?: Record<string, { schema?: unknown }> }
        type Responses = Record<string, { description?: string }>
        type Security = Array<Record<string, string[]>>
        if (operation['parameters'] !== undefined) ep.parameters = operation['parameters'] as Params
        if (operation['requestBody'] !== undefined) ep.requestBody = operation['requestBody'] as ReqBody
        if (operation['responses'] !== undefined) ep.responses = operation['responses'] as Responses
        if (operation['security'] !== undefined) ep.security = operation['security'] as Security
        endpoints.push(ep)
      }
    }
  }

  return { info, servers, endpoints, securitySchemes }
}

function EndpointCard({ ep }: { ep: OpenAPIEndpoint }) {
  const [open, setOpen] = useState(false)
  const color = METHOD_COLORS[ep.method] ?? METHOD_COLORS['get'] ?? ''

  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={cn('shrink-0 rounded border px-2 py-0.5 text-xs font-bold uppercase font-mono', color)}>
          {ep.method}
        </span>
        <code className="flex-1 text-sm font-mono text-foreground">{ep.path}</code>
        {ep.summary && <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-xs">{ep.summary}</span>}
        {open ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border/40 space-y-4 bg-muted/10">
          {ep.description && <p className="text-sm text-muted-foreground">{ep.description}</p>}

          {ep.parameters && ep.parameters.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Parameters</p>
              <div className="space-y-1.5">
                {ep.parameters.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <code className="font-mono text-foreground font-medium">{p.name}</code>
                    <span className="text-muted-foreground/60 rounded border border-border/50 px-1">{p.in}</span>
                    {p.schema?.type && <span className="text-muted-foreground/60 font-mono">{p.schema.type}</span>}
                    {p.required && <span className="text-red-500 font-medium">required</span>}
                    {p.description && <span className="text-muted-foreground">{p.description}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {ep.requestBody && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">Request Body</p>
              {ep.requestBody.description && <p className="text-xs text-muted-foreground">{ep.requestBody.description}</p>}
              {ep.requestBody.content && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {Object.keys(ep.requestBody.content).map((ct) => (
                    <span key={ct} className="text-xs font-mono rounded border border-border/50 px-1.5 py-0.5 bg-muted/30">{ct}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {ep.responses && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Responses</p>
              <div className="space-y-1">
                {Object.entries(ep.responses).map(([code, res]) => (
                  <div key={code} className="flex items-center gap-2 text-xs">
                    <code className={cn('font-mono font-bold', code.startsWith('2') ? 'text-green-500' : code.startsWith('4') ? 'text-yellow-500' : code.startsWith('5') ? 'text-red-500' : 'text-muted-foreground')}>
                      {code}
                    </code>
                    <span className="text-muted-foreground">{res.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const SAMPLE_SPEC = JSON.stringify({
  openapi: '3.0.0',
  info: { title: 'Pet Store API', version: '1.0.0', description: 'A sample API for managing pets' },
  servers: [{ url: 'https://petstore.example.com/v1', description: 'Production' }],
  paths: {
    '/pets': {
      get: {
        summary: 'List all pets',
        tags: ['pets'],
        parameters: [{ name: 'limit', in: 'query', required: false, description: 'Max results to return', schema: { type: 'integer' } }],
        responses: { '200': { description: 'A list of pets' }, '400': { description: 'Bad request' } },
      },
      post: {
        summary: 'Create a pet',
        tags: ['pets'],
        requestBody: { required: true, description: 'Pet to create', content: { 'application/json': {} } },
        responses: { '201': { description: 'Created' }, '422': { description: 'Validation error' } },
      },
    },
    '/pets/{id}': {
      get: {
        summary: 'Get a pet by ID',
        tags: ['pets'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'A pet' }, '404': { description: 'Not found' } },
      },
      delete: {
        summary: 'Delete a pet',
        tags: ['pets'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Deleted' }, '404': { description: 'Not found' } },
      },
    },
  },
}, null, 2)

export function OpenApiViewerTool() {
  const [input, setInput] = useState('')
  const [spec, setSpec] = useState<ParsedSpec | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showInput, setShowInput] = useState(true)

  const parse = useCallback(async (src: string) => {
    if (!src.trim()) { setSpec(null); setError(null); return }
    try {
      let parsed: unknown
      if (src.trim().startsWith('{') || src.trim().startsWith('[')) {
        parsed = JSON.parse(src)
      } else {
        const yaml = (await import('js-yaml')).default
        parsed = yaml.load(src)
      }
      setSpec(parseSpec(parsed))
      setError(null)
      setShowInput(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse spec.')
      setSpec(null)
    }
  }, [])

  const filteredEndpoints = useMemo(() => {
    if (!spec) return []
    if (!search.trim()) return spec.endpoints
    const q = search.toLowerCase()
    return spec.endpoints.filter((ep) =>
      ep.path.toLowerCase().includes(q) ||
      ep.method.includes(q) ||
      ep.summary?.toLowerCase().includes(q) ||
      ep.tags?.some((t) => t.toLowerCase().includes(q))
    )
  }, [spec, search])

  const tagGroups = useMemo(() => {
    const map = new Map<string, OpenAPIEndpoint[]>()
    for (const ep of filteredEndpoints) {
      const tag = ep.tags?.[0] ?? 'default'
      const arr = map.get(tag) ?? []
      arr.push(ep)
      map.set(tag, arr)
    }
    return map
  }, [filteredEndpoints])

  return (
    <ToolLayout>
      <ToolHeader
        title="OpenAPI Viewer"
        description="Paste OpenAPI 3.x or Swagger 2.x JSON/YAML. Explore endpoints, parameters, and responses locally."
        toolbar={
          <>
            <Button variant="outline" size="sm" onClick={() => { setInput(SAMPLE_SPEC); void parse(SAMPLE_SPEC) }}>
              Sample
            </Button>
            {spec && (
              <Button variant="ghost" size="sm" onClick={() => setShowInput((v) => !v)}>
                {showInput ? 'Hide Input' : 'Edit Spec'}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => { setInput(''); setSpec(null); setError(null); setShowInput(true) }} disabled={!input && !spec}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
            </Button>
          </>
        }
      />

      {showInput && (
        <ToolSection label="OpenAPI Spec (JSON or YAML)" className="mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'Paste OpenAPI 3.x or Swagger YAML/JSON here...'}
            className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label="OpenAPI spec input"
            spellCheck={false}
          />
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive mt-2" role="alert">
              {error}
            </div>
          )}
          <div className="flex justify-end mt-2">
            <Button onClick={() => void parse(input)} disabled={!input.trim()}>Parse Spec</Button>
          </div>
        </ToolSection>
      )}

      {spec && (
        <div className="space-y-6">
          {/* API Info */}
          <div className="rounded-lg border border-border/60 p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold">{spec.info.title}</h2>
                <span className="text-xs text-muted-foreground font-mono">v{spec.info.version}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {spec.endpoints.length} endpoint{spec.endpoints.length !== 1 ? 's' : ''}
              </div>
            </div>
            {spec.info.description && (
              <p className="text-sm text-muted-foreground mt-2">{spec.info.description}</p>
            )}
            {spec.servers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {spec.servers.map((s, i) => (
                  <code key={i} className="text-xs bg-muted/40 border border-border/50 rounded px-2 py-1 font-mono">{s.url}</code>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by path, method, or tag…"
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              aria-label="Search endpoints"
            />
          </div>

          {/* Endpoints grouped by tag */}
          {Array.from(tagGroups.entries()).map(([tag, eps]) => (
            <div key={tag}>
              <h3 className="text-sm font-semibold capitalize mb-3 flex items-center gap-2">
                <span>{tag}</span>
                <span className="text-xs text-muted-foreground font-normal font-mono">({eps.length})</span>
              </h3>
              <div className="space-y-2">
                {eps.map((ep, i) => <EndpointCard key={i} ep={ep} />)}
              </div>
            </div>
          ))}

          {filteredEndpoints.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No endpoints match your search.</p>
          )}
        </div>
      )}
    </ToolLayout>
  )
}
