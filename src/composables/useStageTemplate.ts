import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import { mobileQuery, tallQuery, type StageLayout } from '@/layout'
import type { StageTemplate } from '@/types/library'

export function useStageTemplate(preferred: Ref<StageTemplate>): {
  layout: Ref<StageLayout>
} {
  const mobileMedia = window.matchMedia(mobileQuery)
  const tallMedia = window.matchMedia(tallQuery)
  const mobile = ref(mobileMedia.matches)
  const tall = ref(tallMedia.matches)

  function onMobile(event: MediaQueryListEvent): void {
    mobile.value = event.matches
  }

  function onTall(event: MediaQueryListEvent): void {
    tall.value = event.matches
  }

  const layout = computed(() => {
    let next: StageLayout
    if (mobile.value) {
      next = 'mobile'
    } else if (preferred.value === 'stack' && tall.value) {
      next = 'stack'
    } else {
      next = 'spread'
    }
    return next
  })

  onMounted(() => {
    mobile.value = mobileMedia.matches
    tall.value = tallMedia.matches
    mobileMedia.addEventListener('change', onMobile)
    tallMedia.addEventListener('change', onTall)
  })

  onUnmounted(() => {
    mobileMedia.removeEventListener('change', onMobile)
    tallMedia.removeEventListener('change', onTall)
  })

  return { layout }
}
