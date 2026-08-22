import { ref, type Ref } from 'vue'

const STORAGE_FIT = 'meddah.plateFit'

export const PLATE_FITS = ['contain', 'cover'] as const

export type PlateFit = (typeof PLATE_FITS)[number]

const fit = ref<PlateFit>('contain')
let started = false

function isPlateFit(value: unknown): value is PlateFit {
  const ok = value === 'contain' || value === 'cover'
  return ok
}

function parseStored(): PlateFit | null {
  const raw = window.localStorage.getItem(STORAGE_FIT)
  const value = isPlateFit(raw) ? raw : null
  return value
}

function persist(next: PlateFit): void {
  fit.value = next
  window.localStorage.setItem(STORAGE_FIT, next)
}

export function usePlateFit(): {
  fit: Ref<PlateFit>
  setFit: (next: PlateFit) => void
} {
  if (!started) {
    started = true
    fit.value = parseStored() ?? 'contain'
  }

  function setFit(next: PlateFit): void {
    persist(next)
  }

  return { fit, setFit }
}
