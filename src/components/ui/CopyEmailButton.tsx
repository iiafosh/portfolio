import React, { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CopyEmailButtonProps {
  email: string
  /** Visible label before copying. */
  label?: string
  className?: string
}

/** Copies the address to the clipboard; falls back to mailto: when the clipboard is unavailable. */
export const CopyEmailButton: React.FC<CopyEmailButtonProps> = ({
  email,
  label = 'Copy email',
  className = 'btn-primary',
}) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      if (timer.current !== null) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className={className} title={email}>
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        <span className="min-w-[5.5rem] text-left">{copied ? 'Copied!' : label}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `Email address ${email} copied to clipboard` : ''}
      </span>
    </>
  )
}
