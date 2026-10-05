import { useSyncExternalStore } from "react"
import { PREFS_STORAGE_KEY as STORAGE_KEY } from "./prepaint"

// Visitor preferences (sound, the slime, its skin) in one tiny external store.
// Theme lives in next-themes. The skin is applied to <html data-skin> before
// first paint by PREFS_PREPAINT in the root layout.

export const SKINS = [
  { id: "rimuru", label: "Rimuru", hi: "#e8f8ff", mid: "#8fd3f4", deep: "#4a9fd6", line: "#1e3a5f" },
  { id: "sakura", label: "Sakura", hi: "#fff0fa", mid: "#f5b8de", deep: "#d77fb5", line: "#5a2147" },
  { id: "lime", label: "Lime", hi: "#f0fde9", mid: "#a6e3a1", deep: "#5fb36a", line: "#1f4a2a" },
  { id: "ember", label: "Ember", hi: "#fff1e6", mid: "#fbb88c", deep: "#e07a45", line: "#5c2a12" },
  { id: "void", label: "Void", hi: "#f5edff", mid: "#c4a2f5", deep: "#8a5fd6", line: "#33205c" },
] as const

export type SkinId = (typeof SKINS)[number]["id"]

export interface Prefs {
  sound: boolean
  /** Whether the slime is out of the dock. */
  slime: boolean
  skin: SkinId
}


const DEFAULTS: Prefs = { sound: true, slime: true, skin: "rimuru" }

const isSkin = (value: unknown): value is SkinId => SKINS.some((s) => s.id === value)

let state: Prefs = DEFAULTS
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  let stored: Partial<Prefs> = {}
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<Prefs>
  } catch {
    // private mode or garbage — defaults it is
  }
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  state = {
    sound: typeof stored.sound === "boolean" ? stored.sound : DEFAULTS.sound,
    // the slime waits in the dock for reduced-motion visitors until asked
    slime: typeof stored.slime === "boolean" ? stored.slime : !reduced,
    skin: isSkin(stored.skin) ? stored.skin : DEFAULTS.skin,
  }
}

function subscribe(listener: () => void) {
  load()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  load()
  return state
}

export function getPrefs(): Prefs {
  load()
  return state
}

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  load()
  if (state[key] === value) return
  state = { ...state, [key]: value }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // the choice still holds for this visit
  }
  if (key === "skin") document.documentElement.dataset.skin = value as SkinId
  listeners.forEach((l) => l())
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULTS)
}
