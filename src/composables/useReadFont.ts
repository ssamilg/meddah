import { ref, type Ref } from 'vue'

const STORAGE_FONT = 'meddah.readFont'

export const READ_FONTS = ['sans', 'mono', 'serif'] as const

export type ReadFont = (typeof READ_FONTS)[number]

const font = ref<ReadFont>('mono')
let started = false

function isReadFont(value: unknown): value is ReadFont {
  const ok = value === 'sans' || value === 'mono' || value === 'serif'
  return ok
}

function parseStored(): ReadFont | null {
  const raw = window.localStorage.getItem(STORAGE_FONT)
  const value = isReadFont(raw) ? raw : null
  return value
}

function persist(next: ReadFont): void {
  font.value = next
  window.localStorage.setItem(STORAGE_FONT, next)
}

export function useReadFont(): {
  font: Ref<ReadFont>
  setFont: (next: ReadFont) => void
} {
  if (!started) {
    started = true
    font.value = parseStored() ?? 'mono'
  }

  function setFont(next: ReadFont): void {
    persist(next)
  }

  return { font, setFont }
}

export function readFontClass(value: ReadFont): string {
  const classes = {
    sans: 'font-sans',
    mono: 'font-read',
    serif: 'font-literata',
  }
  const cls = classes[value]
  return cls
}
