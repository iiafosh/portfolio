import { useSyncExternalStore } from "react"

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {}
    const mq = window.matchMedia(query)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

/**
 * True only with a real hover (mouse / trackpad). Touch devices fire sticky
 * phantom :hover on tap — gate decorative hover motion behind this.
 */
export function useHoverCapable() {
  return useMediaQuery("(hover: hover) and (pointer: fine)")
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

const noop = () => () => {}

/** False on the server and during hydration, true afterwards. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}

const LOCATION_EVENT = "afosh:location"

function subscribeLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange)
  window.addEventListener(LOCATION_EVENT, onChange)
  return () => {
    window.removeEventListener("popstate", onChange)
    window.removeEventListener(LOCATION_EVENT, onChange)
  }
}

/** Reads ?name= from the address bar (null on the server). */
export function useSearchParam(name: string) {
  return useSyncExternalStore(
    subscribeLocation,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  )
}

/** Sets or clears ?name= without a navigation, and tells useSearchParam. */
export function replaceSearchParam(name: string, value: string | null) {
  const url = new URL(window.location.href)
  if (value === null) url.searchParams.delete(name)
  else url.searchParams.set(name, value)
  window.history.replaceState(window.history.state, "", url)
  window.dispatchEvent(new Event(LOCATION_EVENT))
}
