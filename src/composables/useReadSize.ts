import { computed, ref, type Ref } from 'vue'
import { mobileQuery } from '@/layout'

const STORAGE_READ = 'meddah.readSize'
const READ_MIN = 14
const READ_MAX = 22
const READ_STEP = 1
const READ_MOBILE = 15
const READ_DESKTOP = 18

const size = ref(READ_DESKTOP)
let started = false

function defaultReadSize(): number {
  const mobile = window.matchMedia(mobileQuery).matches
  const value = mobile ? READ_MOBILE : READ_DESKTOP
  return value
}

function parseStored(): number | null {
  const raw = window.localStorage.getItem(STORAGE_READ)
  const parsed = raw === null ? NaN : Number(raw)
  const valid = Number.isFinite(parsed) && parsed >= READ_MIN && parsed <= READ_MAX
  const value = valid ? parsed : null
  return value
}

function persist(next: number): void {
  size.value = next
  window.localStorage.setItem(STORAGE_READ, String(next))
}

export function useReadSize(): {
  size: Ref<number>
  canSmaller: Ref<boolean>
  canBigger: Ref<boolean>
  smaller: () => void
  bigger: () => void
} {
  if (!started) {
    started = true
    size.value = parseStored() ?? defaultReadSize()
  }

  const canSmaller = computed(() => size.value > READ_MIN)
  const canBigger = computed(() => size.value < READ_MAX)

  function smaller(): void {
    if (size.value > READ_MIN) {
      persist(size.value - READ_STEP)
    }
  }

  function bigger(): void {
    if (size.value < READ_MAX) {
      persist(size.value + READ_STEP)
    }
  }

  return { size, canSmaller, canBigger, smaller, bigger }
}
