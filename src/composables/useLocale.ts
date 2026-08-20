import { onMounted, ref, type Ref } from 'vue'
import type { Locale } from '@/types/library'

const STORAGE_LOCALE = 'meddah.locale'
const locale = ref<Locale>('tr')

function readLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_LOCALE)
  const value: Locale = stored === 'en' ? 'en' : 'tr'
  return value
}

export function useLocale(): {
  locale: Ref<Locale>
  toggleLocale: () => void
} {
  function toggleLocale(): void {
    const next: Locale = locale.value === 'tr' ? 'en' : 'tr'
    locale.value = next
    window.localStorage.setItem(STORAGE_LOCALE, next)
  }

  onMounted(() => {
    locale.value = readLocale()
  })

  return { locale, toggleLocale }
}
