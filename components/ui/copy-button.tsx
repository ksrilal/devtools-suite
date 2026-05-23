'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from './button'
import { copyToClipboard } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  onCopy?: () => void
}

export function CopyButton({ text, className, size = 'sm', onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleCopy}
      className={cn('gap-1.5', className)}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Copy</span>
        </>
      )}
    </Button>
  )
}
