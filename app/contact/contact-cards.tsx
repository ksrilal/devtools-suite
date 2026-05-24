'use client'

import { useState } from 'react'
import { copyToClipboard } from '@/lib/utils'
import { Copy, Check, ExternalLink, Github, Mail } from 'lucide-react'

function CopyableCard({
  label,
  value,
  href,
  icon: Icon,
  isExternal,
}: {
  label: string
  value: string
  href: string
  icon: React.ElementType
  isExternal?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border/50 p-5 hover:border-border hover:bg-muted/30 transition-colors group">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 p-2 rounded-md bg-muted/50 text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">{label}</p>
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors break-all"
          >
            {value}
            {isExternal && <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />}
          </a>
        </div>
        <button
          onClick={() => void handleCopy()}
          aria-label={`Copy ${label}`}
          className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied
            ? <Check className="h-3.5 w-3.5 text-green-500" />
            : <Copy className="h-3.5 w-3.5" />
          }
        </button>
      </div>
    </div>
  )
}

export function ContactCards() {
  return (
    <div className="space-y-3 mb-8">
      <CopyableCard
        label="GitHub Repository"
        value="github.com/ksrilal/devtools-suite"
        href="https://github.com/ksrilal/devtools-suite"
        icon={Github}
        isExternal
      />
      <CopyableCard
        label="Email"
        value="devtoolssuite.dev@gmail.com"
        href="mailto:devtoolssuite.dev@gmail.com"
        icon={Mail}
      />
    </div>
  )
}
