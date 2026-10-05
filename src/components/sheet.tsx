"use client"

import { useEffect, type ReactNode } from "react"

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { sounds } from "@/lib/sound"
import { CloseIcon } from "./icons"

/**
 * The case-study bottom sheet (yust.dev's project drawers) on Base UI's
 * Drawer: swipe or flick down to dismiss, Esc, or the close button.
 * While it is open the dock steps out of the way.
 */
export function Sheet({
  open,
  onOpenChange,
  eyebrow,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.dataset.sheetOpen = ""
    return () => {
      delete root.dataset.sheetOpen
    }
  }, [open])

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) sounds.open()
        else sounds.close()
        onOpenChange(next)
      }}
    >
      <DrawerContent className="mx-auto w-full max-w-3xl rounded-t-[1.75rem] border-x border-border bg-background text-foreground shadow-[0_-20px_50px_rgb(0_0_0/0.18)] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-2.5rem)] sm:rounded-t-[2.25rem]">
        <div className="flex shrink-0 justify-center pt-3 pb-1" aria-hidden="true">
          <span className="h-1.5 w-12 rounded-full bg-foreground/15" />
        </div>
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-2 pb-4 sm:px-8">
          <div className="min-w-0">
            <p className="page-eyebrow truncate">{eyebrow}</p>
            <DrawerTitle className="mt-1.5 font-display font-bold tracking-[-0.045em] text-[1.5rem] leading-tight text-foreground sm:text-[1.875rem]">
              {title}
            </DrawerTitle>
            {description ? (
              <DrawerDescription className="mt-2 max-w-xl text-left text-sm leading-relaxed text-muted-foreground">
                {description}
              </DrawerDescription>
            ) : null}
          </div>
          <DrawerClose
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[color,background-color,transform] duration-150 hover:bg-[var(--hover)] hover:text-foreground active:scale-[0.94]"
            aria-label="Close"
          >
            <CloseIcon className="size-4" />
          </DrawerClose>
        </div>
        <div className="sheet-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-10">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/** One titled block inside a sheet. */
export function SheetBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="hairline-top py-5">
      <h3 className="mono-label">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}
