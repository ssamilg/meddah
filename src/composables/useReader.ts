import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import { isPiece, type Locale, type Piece, type Scene } from '@/types/piece'

const STORAGE_LOCALE = 'meddah.locale'
const STORAGE_IMAGES = 'meddah.imagesOn'

function readLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_LOCALE)
  const locale: Locale = stored === 'en' ? 'en' : 'tr'
  return locale
}

function readImagesOn(): boolean {
  const stored = window.localStorage.getItem(STORAGE_IMAGES)
  const on = stored !== '0'
  return on
}

export function useReader(rawPiece: unknown): {
  piece: Piece | null
  scenes: Scene[]
  index: Ref<number>
  locale: Ref<Locale>
  imagesOn: Ref<boolean>
  scene: Ref<Scene | undefined>
  go: (delta: number) => void
  goTo: (nextIndex: number) => void
  toggleLocale: () => void
  toggleImages: () => void
} {
  const piece = isPiece(rawPiece) ? rawPiece : null
  const scenes = piece?.scenes ?? []
  const index = ref(0)
  const locale = ref<Locale>(readLocale())
  const imagesOn = ref(readImagesOn())
  const scene = computed(() => scenes[index.value])

  function goTo(nextIndex: number): void {
    const last = Math.max(scenes.length - 1, 0)
    const clamped = Math.min(Math.max(nextIndex, 0), last)
    index.value = clamped
  }

  function go(delta: number): void {
    goTo(index.value + delta)
  }

  function toggleLocale(): void {
    const next: Locale = locale.value === 'tr' ? 'en' : 'tr'
    locale.value = next
    window.localStorage.setItem(STORAGE_LOCALE, next)
  }

  function toggleImages(): void {
    const next = !imagesOn.value
    imagesOn.value = next
    window.localStorage.setItem(STORAGE_IMAGES, next ? '1' : '0')
  }

  function onKey(event: KeyboardEvent): void {
    const target = event.target
    const typing =
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
    if (!typing) {
      if (event.key === 'ArrowRight' || event.key === 'j' || event.key === 'J') {
        go(1)
      } else if (event.key === 'ArrowLeft' || event.key === 'k' || event.key === 'K') {
        go(-1)
      } else if (event.key === 'i' || event.key === 'I') {
        toggleImages()
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKey)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKey)
  })

  return { piece, scenes, index, locale, imagesOn, scene, go, goTo, toggleLocale, toggleImages }
}
