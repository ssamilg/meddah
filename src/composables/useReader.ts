import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { sceneImage, type Episode, type Scene } from '@/types/library'

const STORAGE_IMAGES = 'meddah.imagesOn'

function readImagesOn(): boolean {
  const stored = window.localStorage.getItem(STORAGE_IMAGES)
  const on = stored !== '0'
  return on
}

export function useReader(episode: Ref<Episode | null>): {
  episode: Ref<Episode | null>
  scenes: Ref<Scene[]>
  index: Ref<number>
  imagesOn: Ref<boolean>
  scene: Ref<Scene | undefined>
  go: (delta: number) => void
  goTo: (nextIndex: number) => void
  toggleImages: () => void
} {
  const index = ref(0)
  const imagesOn = ref(readImagesOn())
  const scenes = computed(() => episode.value?.scenes ?? [])
  const scene = computed(() => scenes.value[index.value])

  function goTo(nextIndex: number): void {
    const last = Math.max(scenes.value.length - 1, 0)
    const clamped = Math.min(Math.max(nextIndex, 0), last)
    index.value = clamped
  }

  function go(delta: number): void {
    goTo(index.value + delta)
  }

  function indexFromHash(): number {
    const id = window.location.hash.replace(/^#/, '')
    const found = scenes.value.findIndex((row) => row.id === id)
    const next = found >= 0 ? found : 0
    return next
  }

  function toggleImages(): void {
    if (sceneImage(scene.value)) {
      const next = !imagesOn.value
      imagesOn.value = next
      window.localStorage.setItem(STORAGE_IMAGES, next ? '1' : '0')
    }
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

  watch(
    () => episode.value?.id,
    () => {
      index.value = indexFromHash()
    },
    { immediate: true },
  )

  onMounted(() => {
    window.addEventListener('keydown', onKey)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKey)
  })

  return { episode, scenes, index, imagesOn, scene, go, goTo, toggleImages }
}
