import React, {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

// Hover cards (yust.dev style). A HoverCardGroup owns a single `activeCard`, so
// only one card is open at a time. Cards open on mouse hover and on keyboard
// focus, close on Escape / pointer leave (after a short delay so the pointer
// can travel into the card), and never open for touch: a tap just follows the
// trigger's link.

const VIEWPORT_MARGIN = 12
const GAP = 8

interface HoverCardController {
  active: string | null
  open: (id: string) => void
  scheduleClose: () => void
  cancelClose: () => void
  close: () => void
}

const HoverCardContext = createContext<HoverCardController | null>(null)

export const HoverCardGroup: React.FC<{ closeDelay?: number; children: React.ReactNode }> = ({
  closeDelay = 150,
  children,
}) => {
  const [active, setActive] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const cancelClose = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const open = useCallback(
    (id: string) => {
      cancelClose()
      setActive(id)
    },
    [cancelClose],
  )

  const close = useCallback(() => {
    cancelClose()
    setActive(null)
  }, [cancelClose])

  const scheduleClose = useCallback(() => {
    cancelClose()
    timer.current = window.setTimeout(() => {
      timer.current = null
      setActive(null)
    }, closeDelay)
  }, [cancelClose, closeDelay])

  useEffect(() => cancelClose, [cancelClose])

  const value = useMemo(
    () => ({ active, open, scheduleClose, cancelClose, close }),
    [active, open, scheduleClose, cancelClose, close],
  )
  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>
}

function isKeyboardFocus(el: EventTarget | null): boolean {
  if (!(el instanceof Element)) return false
  try {
    return el.matches(':focus-visible')
  } catch {
    return false
  }
}

interface HoverCardProps {
  /** Unique within the group. */
  id: string
  /** Accessible name of the card dialog. */
  label: string
  /** Card body. */
  content: React.ReactNode
  /** The trigger: a link, button or plain element. */
  children: React.ReactElement
  /** Preferred card width in px (clamped to the viewport). */
  width?: number
  /** Horizontal alignment relative to the trigger before viewport clamping. */
  align?: 'start' | 'center' | 'end'
  className?: string
}

export const HoverCard: React.FC<HoverCardProps> = ({
  id,
  label,
  content,
  children,
  width = 320,
  align = 'center',
  className = '',
}) => {
  const ctl = useContext(HoverCardContext)
  if (!ctl) throw new Error('HoverCard must be rendered inside a HoverCardGroup')
  const { active, open, scheduleClose, cancelClose, close } = ctl
  const isOpen = active === id

  const panelId = `hovercard-${useId().replace(/:/g, '')}`
  const triggerRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Position the fixed panel below the trigger, clamped to the viewport; flip
  // above only when there is no room below.
  const place = useCallback(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!trigger || !panel) return
    const t = trigger.getBoundingClientRect()
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const w = Math.min(width, vw - VIEWPORT_MARGIN * 2)
    panel.style.width = `${w}px`

    let left =
      align === 'start' ? t.left : align === 'end' ? t.right - w : t.left + t.width / 2 - w / 2
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - VIEWPORT_MARGIN - w))

    const h = panel.offsetHeight
    let top = t.bottom + GAP
    if (top + h > vh - VIEWPORT_MARGIN && t.top - GAP - h > VIEWPORT_MARGIN) {
      top = t.top - GAP - h
      panel.style.transformOrigin = 'bottom center'
    } else {
      panel.style.transformOrigin = 'top center'
    }
    panel.style.left = `${Math.round(left)}px`
    panel.style.top = `${Math.round(top)}px`
    panel.style.visibility = 'visible'
  }, [width, align])

  useLayoutEffect(() => {
    if (!isOpen) return
    place()
    let frame = 0
    const onMove = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(place)
    }
    window.addEventListener('scroll', onMove, { passive: true, capture: true })
    window.addEventListener('resize', onMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onMove, { capture: true })
      window.removeEventListener('resize', onMove)
    }
  }, [isOpen, place])

  // Escape closes; if focus was inside the card, hand it back to the trigger.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const focusInPanel = panelRef.current?.contains(document.activeElement)
      close()
      if (focusInPanel) {
        triggerRef.current?.querySelector<HTMLElement>('a, button, [tabindex]')?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') open(id)
  }
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') scheduleClose()
  }
  const onFocus = (e: React.FocusEvent) => {
    if (isKeyboardFocus(e.target)) open(id)
  }
  const onBlur = (e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null
    if (next && (triggerRef.current?.contains(next) || panelRef.current?.contains(next))) return
    if (isOpen) scheduleClose()
  }

  const trigger = cloneElement(children, {
    'aria-describedby': isOpen ? panelId : undefined,
  })

  return (
    <>
      <span
        ref={triggerRef}
        className={`relative inline-flex ${className}`}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {trigger}
      </span>
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label={label}
            className="fixed z-[90] animate-pop-in"
            style={{ top: 0, left: 0, width, visibility: 'hidden' }}
            onPointerEnter={cancelClose}
            onPointerLeave={onPointerLeave}
            onFocus={cancelClose}
            onBlur={onBlur}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}

/** Shared surface for card bodies. */
export const HoverCardSurface: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-slime-400/20 text-left shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_24px_60px_-20px_rgba(0,0,0,0.95),0_0_40px_-18px_rgba(79,200,255,0.45)] ring-1 ring-black/50 ${className}`}
    style={{ background: 'linear-gradient(180deg, #111829 0%, #0a0e19 70%)' }}
  >
    {children}
  </div>
)
