'use client'

import { useState } from 'react'
import { generateCSharpClasses } from '@/lib/tools/json-to-csharp'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Trash2 } from 'lucide-react'

const SAMPLE = JSON.stringify({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
  isActive: true,
  address: {
    street: '123 Main St',
    city: 'Anytown',
  },
  tags: ['admin', 'user'],
}, null, 2)

export function JsonToCSharpTool() {
  const [input, setInput] = useState('')
  const [rootName, setRootName] = useState('User')
  const [nullable, setNullable] = useState(true)
  const [namespaceName, setNamespaceName] = useState('MyApp.Models')

  const result = generateCSharpClasses(input, rootName, nullable, namespaceName)

  return (
    <ToolLayout>
      <ToolHeader
        title="JSON → C# Classes"
        description="Generate C# model classes from JSON with PascalCase properties, nullable support, and System.Text.Json attributes."
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

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground shrink-0" htmlFor="cs-root-name">Class name</label>
              <input
                id="cs-root-name"
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="w-28 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="MyModel"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground shrink-0" htmlFor="cs-ns">Namespace</label>
              <input
                id="cs-ns"
                type="text"
                value={namespaceName}
                onChange={(e) => setNamespaceName(e.target.value)}
                className="w-40 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="MyApp.Models"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={nullable} onChange={(e) => setNullable(e.target.checked)} className="rounded" />
              Nullable types
            </label>
          </div>
        </div>

        <ToolSection label="Generated C# Code">
          {result.error ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {result.error}
            </div>
          ) : result.code ? (
            <>
              <pre className="h-72 overflow-auto rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-mono whitespace-pre">
                {result.code}
              </pre>
              <div className="mt-2 flex justify-end">
                <CopyButton text={result.code} />
              </div>
            </>
          ) : (
            <div className="h-72 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Paste JSON to generate C# classes
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
