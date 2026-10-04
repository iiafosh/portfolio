import React, { useEffect, useId, useState } from 'react'
import { AlertCircle, Check, Loader2 } from 'lucide-react'

export const inputClass =
  'w-full rounded-lg border border-line bg-ink-950/60 px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-slime-400/50 focus:outline-none focus:ring-2 focus:ring-slime-400/20'

interface FieldProps {
  label: string
  hint?: string
  className?: string
  children: (id: string) => React.ReactNode
}

/** Label + control + optional hint. The child render prop receives the input id. */
export const Field: React.FC<FieldProps> = ({ label, hint, className, children }) => {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-fg-faint">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-[11px] text-fg-faint">{hint}</p>}
    </div>
  )
}

interface MutationLike {
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  error: unknown
  submittedAt: number
}

export function errorText(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message)
  return 'Something went wrong.'
}

/** Inline "Saving… / Saved / error" feedback for a TanStack mutation. */
export const SaveStatus: React.FC<{ mutation: MutationLike; className?: string }> = ({ mutation, className = '' }) => {
  const [showSaved, setShowSaved] = useState(false)
  useEffect(() => {
    if (!mutation.isSuccess) return
    setShowSaved(true)
    const t = window.setTimeout(() => setShowSaved(false), 2500)
    return () => window.clearTimeout(t)
  }, [mutation.isSuccess, mutation.submittedAt])

  let content: React.ReactNode = null
  if (mutation.isPending) {
    content = (
      <span className="inline-flex items-center gap-1 text-fg-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
      </span>
    )
  } else if (mutation.isError) {
    content = (
      <span className="inline-flex items-center gap-1 text-rose-300">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errorText(mutation.error)}
      </span>
    )
  } else if (showSaved) {
    content = (
      <span className="inline-flex items-center gap-1 text-live animate-pop-in">
        <Check className="h-3.5 w-3.5" /> Saved
      </span>
    )
  }
  return (
    <span role="status" className={`text-xs ${className}`}>
      {content}
    </span>
  )
}

interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  active?: boolean
  tone?: 'default' | 'danger'
}

/** Compact square icon button for dense admin rows (still 36px+ hit area). */
export const ToolButton: React.FC<ToolButtonProps> = ({ label, active, tone = 'default', className = '', children, ...rest }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    aria-pressed={active}
    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:pointer-events-none disabled:opacity-30 ${
      active
        ? 'border-slime-400/40 bg-slime-400/10 text-slime-300'
        : tone === 'danger'
          ? 'border-transparent text-fg-faint hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300'
          : 'border-transparent text-fg-faint hover:border-line hover:bg-white/[0.05] hover:text-fg'
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
)

export const PanelHeader: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 className="font-display text-lg font-semibold text-fg">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-fg-muted">{description}</p>}
    </div>
    {action}
  </div>
)
