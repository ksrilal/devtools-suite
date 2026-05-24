'use client'

import { useState, useCallback } from 'react'
import { formatDockerCompose, minifyDockerCompose } from '@/lib/tools/docker-compose-formatter'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Trash2 } from 'lucide-react'

const SAMPLE = `version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - db
    environment:
      - NODE_ENV=production
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:`

export function DockerComposeFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'format' | 'minify'>('format')

  const run = useCallback(async (src: string, m: 'format' | 'minify') => {
    if (!src.trim()) { setOutput(''); setError(null); return }
    const fn = m === 'format' ? formatDockerCompose : minifyDockerCompose
    const result = await fn(src)
    setOutput(result.output)
    setError(result.error)
  }, [])

  const handleInput = useCallback((val: string) => {
    setInput(val)
    void run(val, mode)
  }, [run, mode])

  const handleMode = useCallback((m: 'format' | 'minify') => {
    setMode(m)
    void run(input, m)
  }, [run, input])

  return (
    <ToolLayout>
      <ToolHeader
        title="Docker Compose Formatter"
        description="Beautify or minify docker-compose YAML files with validation. Supports any valid YAML."
        toolbar={
          <>
            <Button variant="outline" size="sm" onClick={() => handleInput(SAMPLE)}>Sample</Button>
            <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); setError(null) }} disabled={!input}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
            </Button>
          </>
        }
      />

      <div className="flex gap-2 mb-4">
        {(['format', 'minify'] as const).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleMode(m)}
          >
            {m === 'format' ? 'Beautify' : 'Minify'}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label="Input YAML">
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Paste your docker-compose.yml here..."
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label="YAML input"
            spellCheck={false}
          />
        </ToolSection>

        <ToolSection label="Output">
          {error ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </div>
          ) : output ? (
            <>
              <pre className="h-80 overflow-auto rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-mono whitespace-pre">
                {output}
              </pre>
              <div className="mt-2 flex justify-end">
                <CopyButton text={output} />
              </div>
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Formatted YAML will appear here
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
