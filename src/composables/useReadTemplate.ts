import { computed, ref, type Ref } from 'vue'
import { isStageTemplate, type StageTemplate } from '@/types/library'

const STORAGE_TEMPLATE = 'meddah.readTemplate'

const override = ref<StageTemplate | null>(null)
let started = false

function parseStored(): StageTemplate | null {
  const raw = window.localStorage.getItem(STORAGE_TEMPLATE)
  const value = isStageTemplate(raw) ? raw : null
  return value
}

function persist(next: StageTemplate): void {
  override.value = next
  window.localStorage.setItem(STORAGE_TEMPLATE, next)
}

export function useReadTemplate(preferred: Ref<StageTemplate>): {
  template: Ref<StageTemplate>
  setTemplate: (next: StageTemplate) => void
} {
  if (!started) {
    started = true
    override.value = parseStored()
  }

  const template = computed(() => override.value ?? preferred.value)

  function setTemplate(next: StageTemplate): void {
    persist(next)
  }

  return { template, setTemplate }
}
