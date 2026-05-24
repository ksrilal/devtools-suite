'use client'

import { useState } from 'react'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { CopyButton } from '@/components/ui/copy-button'

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
type AlignContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'

interface FlexConfig {
  flexDirection: FlexDirection
  justifyContent: JustifyContent
  alignItems: AlignItems
  flexWrap: FlexWrap
  gap: string
  alignContent: AlignContent
  itemCount: number
}

const PRESETS: Array<{ label: string; config: Partial<FlexConfig> }> = [
  { label: 'Centered', config: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', gap: '8px' } },
  { label: 'Space Between', config: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } },
  { label: 'Column Stack', config: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', gap: '8px' } },
  { label: 'Wrap Grid', config: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', itemCount: 8 } },
]

const ITEM_COLORS = ['bg-blue-500/70', 'bg-purple-500/70', 'bg-green-500/70', 'bg-orange-500/70', 'bg-pink-500/70', 'bg-cyan-500/70', 'bg-yellow-500/70', 'bg-red-500/70']

function SelectRow<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={label}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export function FlexboxPlaygroundTool() {
  const [config, setConfig] = useState<FlexConfig>({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    gap: '8px',
    alignContent: 'flex-start',
    itemCount: 5,
  })

  function update<K extends keyof FlexConfig>(key: K, value: FlexConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }))
  }

  const css = `display: flex;
flex-direction: ${config.flexDirection};
justify-content: ${config.justifyContent};
align-items: ${config.alignItems};
flex-wrap: ${config.flexWrap};
gap: ${config.gap};${config.flexWrap !== 'nowrap' ? `\nalign-content: ${config.alignContent};` : ''}`

  const previewStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: config.flexDirection,
    justifyContent: config.justifyContent,
    alignItems: config.alignItems,
    flexWrap: config.flexWrap,
    gap: config.gap,
    alignContent: config.flexWrap !== 'nowrap' ? config.alignContent : undefined,
  }

  return (
    <ToolLayout>
      <ToolHeader
        title="Flexbox Playground"
        description="Experiment with CSS Flexbox properties live. Adjust controls and see the result instantly."
      />

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setConfig((c) => ({ ...c, ...p.config }))}
            className="px-3 py-1.5 text-xs rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent/60 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <ToolSection label="Container Properties">
            <div className="space-y-3">
              <SelectRow label="flex-direction" value={config.flexDirection} options={['row', 'row-reverse', 'column', 'column-reverse']} onChange={(v) => update('flexDirection', v)} />
              <SelectRow label="justify-content" value={config.justifyContent} options={['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']} onChange={(v) => update('justifyContent', v)} />
              <SelectRow label="align-items" value={config.alignItems} options={['flex-start', 'flex-end', 'center', 'stretch', 'baseline']} onChange={(v) => update('alignItems', v)} />
              <SelectRow label="flex-wrap" value={config.flexWrap} options={['nowrap', 'wrap', 'wrap-reverse']} onChange={(v) => update('flexWrap', v)} />
              {config.flexWrap !== 'nowrap' && (
                <SelectRow label="align-content" value={config.alignContent} options={['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch']} onChange={(v) => update('alignContent', v)} />
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">gap: <span className="font-mono text-foreground">{config.gap}</span></label>
                <input
                  type="range" min={0} max={48} step={4}
                  value={parseInt(config.gap)}
                  onChange={(e) => update('gap', `${e.target.value}px`)}
                  className="w-full accent-foreground"
                  aria-label="Gap"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Items: <span className="font-mono text-foreground">{config.itemCount}</span></label>
                <input
                  type="range" min={1} max={12}
                  value={config.itemCount}
                  onChange={(e) => update('itemCount', Number(e.target.value))}
                  className="w-full accent-foreground"
                  aria-label="Item count"
                />
              </div>
            </div>
          </ToolSection>
        </div>

        <div className="space-y-4">
          {/* Preview */}
          <ToolSection label="Live Preview">
            <div
              className="min-h-48 rounded-lg border-2 border-dashed border-border/60 bg-muted/20 p-4"
              style={previewStyle}
              aria-label="Flexbox preview"
            >
              {Array.from({ length: config.itemCount }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-md ${ITEM_COLORS[i % ITEM_COLORS.length] ?? 'bg-blue-500/70'} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  style={{ width: '60px', height: '60px' }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </ToolSection>

          {/* Generated CSS */}
          <ToolSection label="Generated CSS">
            <pre className="rounded-md border border-border bg-muted/30 px-3 py-2.5 text-sm font-mono whitespace-pre">
              {css}
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={css} />
            </div>
          </ToolSection>
        </div>
      </div>
    </ToolLayout>
  )
}
