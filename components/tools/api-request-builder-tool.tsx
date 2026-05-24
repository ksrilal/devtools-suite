'use client'

import { useState, useCallback } from 'react'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
interface KVPair { key: string; value: string }

interface ResponseState {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
  error: string | null
}

const METHOD_COLORS: Record<Method, string> = {
  GET:    'text-green-500',
  POST:   'text-blue-500',
  PUT:    'text-yellow-500',
  PATCH:  'text-orange-500',
  DELETE: 'text-red-500',
}

function KVEditor({ pairs, onChange, placeholder }: { pairs: KVPair[]; onChange: (p: KVPair[]) => void; placeholder?: string }) {
  const add = () => onChange([...pairs, { key: '', value: '' }])
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i))
  const set = (i: number, field: 'key' | 'value', val: string) =>
    onChange(pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p))

  return (
    <div className="space-y-2">
      {pairs.map((p, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={p.key}
            onChange={(e) => set(i, 'key', e.target.value)}
            placeholder={placeholder ?? 'Key'}
            className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
          />
          <input
            value={p.value}
            onChange={(e) => set(i, 'value', e.target.value)}
            placeholder="Value"
            className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
          />
          <button onClick={() => remove(i)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Remove row">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <Plus className="h-3.5 w-3.5" />Add row
      </button>
    </div>
  )
}

function buildUrl(base: string, params: KVPair[]): string {
  const active = params.filter((p) => p.key.trim())
  if (!active.length) return base
  const qs = active.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')
  return base.includes('?') ? `${base}&${qs}` : `${base}?${qs}`
}

function buildCurl(method: Method, url: string, headers: KVPair[], body: string): string {
  const parts = [`curl -X ${method} '${url}'`]
  headers.filter((h) => h.key).forEach((h) => parts.push(`  -H '${h.key}: ${h.value}'`))
  if (body && !['GET', 'DELETE'].includes(method)) parts.push(`  -d '${body.replace(/'/g, "\\'")}'`)
  return parts.join(' \\\n')
}

function statusColor(status: number) {
  if (status < 300) return 'text-green-500'
  if (status < 400) return 'text-yellow-500'
  return 'text-red-500'
}

type TabKey = 'params' | 'headers' | 'body'

export function ApiRequestBuilderTool() {
  const [method, setMethod] = useState<Method>('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [params, setParams] = useState<KVPair[]>([])
  const [headers, setHeaders] = useState<KVPair[]>([{ key: 'Content-Type', value: 'application/json' }])
  const [body, setBody] = useState('')
  const [tab, setTab] = useState<TabKey>('params')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ResponseState | null>(null)
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body')

  const fullUrl = buildUrl(url, params)
  const curl = buildCurl(method, fullUrl, headers, body)

  const sendRequest = useCallback(async () => {
    if (!url.trim()) return
    setLoading(true)
    setResponse(null)
    const start = Date.now()
    try {
      const reqHeaders: Record<string, string> = {}
      headers.filter((h) => h.key).forEach((h) => { reqHeaders[h.key] = h.value })

      const init: RequestInit = { method, headers: reqHeaders }
      if (body && !['GET', 'DELETE'].includes(method)) init.body = body

      const res = await fetch(fullUrl, init)
      const elapsed = Date.now() - start
      const resHeaders: Record<string, string> = {}
      res.headers.forEach((v, k) => { resHeaders[k] = v })

      let text = ''
      try { text = await res.text() } catch { /* ignore */ }

      // Try to pretty-print JSON
      try {
        const j = JSON.parse(text)
        text = JSON.stringify(j, null, 2)
      } catch { /* leave as-is */ }

      setResponse({ status: res.status, statusText: res.statusText, headers: resHeaders, body: text, time: elapsed, error: null })
    } catch (e) {
      setResponse({
        status: 0,
        statusText: '',
        headers: {},
        body: '',
        time: Date.now() - start,
        error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
      })
    } finally {
      setLoading(false)
    }
  }, [url, method, headers, body, fullUrl])

  const inputTabs: TabKey[] = ['params', 'headers', 'body']

  return (
    <ToolLayout>
      <ToolHeader
        title="API Request Builder"
        description="Build and send HTTP requests from your browser. Inspect responses, copy cURL commands."
      />

      {/* URL bar */}
      <div className="flex gap-2 mb-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as Method)}
          className={cn('rounded-md border border-input bg-background px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', METHOD_COLORS[method])}
          aria-label="HTTP method"
        >
          {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as Method[]).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
          aria-label="Request URL"
          onKeyDown={(e) => { if (e.key === 'Enter') void sendRequest() }}
        />
        <Button onClick={() => void sendRequest()} disabled={!url.trim() || loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending</> : 'Send'}
        </Button>
      </div>

      {/* Input tabs */}
      <div className="flex gap-0 border-b border-border/50 mb-4">
        {inputTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px',
              tab === t ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
            {t === 'params' && params.filter((p) => p.key).length > 0 && (
              <span className="ml-1.5 text-xs rounded-full bg-foreground/10 px-1.5 py-0.5">{params.filter((p) => p.key).length}</span>
            )}
            {t === 'headers' && headers.filter((h) => h.key).length > 0 && (
              <span className="ml-1.5 text-xs rounded-full bg-foreground/10 px-1.5 py-0.5">{headers.filter((h) => h.key).length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mb-6">
        {tab === 'params' && <KVEditor pairs={params} onChange={setParams} placeholder="Parameter name" />}
        {tab === 'headers' && <KVEditor pairs={headers} onChange={setHeaders} placeholder="Header name" />}
        {tab === 'body' && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'}
            disabled={method === 'GET' || method === 'DELETE'}
            className="w-full h-36 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground disabled:opacity-50"
            aria-label="Request body"
            spellCheck={false}
          />
        )}
      </div>

      {/* cURL */}
      <ToolSection label="cURL Command" className="mb-6">
        <div className="relative">
          <pre className="rounded-md border border-border bg-muted/30 px-3 py-2.5 text-xs font-mono whitespace-pre-wrap break-all">
            {curl}
          </pre>
          <div className="mt-1.5 flex justify-end">
            <CopyButton text={curl} />
          </div>
        </div>
      </ToolSection>

      {/* Response */}
      {response && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Response</p>
            {response.error ? (
              <span className="text-sm text-red-500">{response.error}</span>
            ) : (
              <>
                <span className={cn('text-sm font-bold font-mono', statusColor(response.status))}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-xs text-muted-foreground">{response.time}ms</span>
              </>
            )}
          </div>

          {!response.error && (
            <>
              <div className="flex gap-0 border-b border-border/50">
                {(['body', 'headers'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setResponseTab(t)}
                    className={cn(
                      'px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px',
                      responseTab === t ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {responseTab === 'body' && (
                <div className="relative">
                  <pre className="max-h-96 overflow-auto rounded-md border border-border bg-muted/30 px-3 py-2.5 text-xs font-mono whitespace-pre">
                    {response.body || '(empty body)'}
                  </pre>
                  {response.body && (
                    <div className="mt-1.5 flex justify-end">
                      <CopyButton text={response.body} />
                    </div>
                  )}
                </div>
              )}

              {responseTab === 'headers' && (
                <div className="rounded-md border border-border bg-muted/30 divide-y divide-border/40">
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-4 px-3 py-2 text-xs font-mono">
                      <span className="text-muted-foreground shrink-0 min-w-[160px]">{k}</span>
                      <span className="text-foreground break-all">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-4 rounded-md border border-border/50 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
        Requests are sent directly from your browser. CORS restrictions apply — APIs must allow cross-origin requests or use a CORS-enabled endpoint.
      </div>
    </ToolLayout>
  )
}
