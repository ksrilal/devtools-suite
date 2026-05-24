'use client'

import { useState } from 'react'
import { generateJSONSchema } from '@/lib/tools/json-schema-generator'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Trash2 } from 'lucide-react'

const SAMPLE = JSON.stringify({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
  active: true,
  address: {
    street: '123 Main St',
    city: 'Anytown',
  },
  tags: ['admin', 'user'],
}, null, 2)

export function JsonSchemaGeneratorTool() {
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('User')

  const result = generateJSONSchema(input, title)

  return (
    <ToolLayout>
      <ToolHeader
        title="JSON Schema Generator"
        description="Generate a JSON Schema (draft 2020-12) from any JSON object. Supports nested objects and arrays."
        toolbar={
          <>
            <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE)}>Sample</Button>
            <Button variant="ghost" size="sm" onClick={() => setInput('')} disabled={!input}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <ToolSection label="JSON Input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={'{\n  "id": 1,\n  "name": "Alice"\n}'}
              className="w-full h-72 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              aria-label="JSON input"
              spellCheck={false}
            />
          </ToolSection>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground shrink-0" htmlFor="schema-title">Schema title</label>
            <input
              id="schema-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-40 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="MySchema"
            />
          </div>
        </div>

        <ToolSection label="Generated JSON Schema">
          {result.error ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {result.error}
            </div>
          ) : result.schema ? (
            <>
              <pre className="h-72 overflow-auto rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-mono whitespace-pre">
                {result.schema}
              </pre>
              <div className="mt-2 flex justify-end">
                <CopyButton text={result.schema} />
              </div>
            </>
          ) : (
            <div className="h-72 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Paste JSON to generate schema
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
