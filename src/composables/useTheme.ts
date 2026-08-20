import { onMounted, ref, type Ref } from 'vue'
import { applyThemeClass, readTheme, STORAGE_THEME, type Theme } from '@/theme'

export function useTheme(): {
  theme: Ref<Theme>
  toggleTheme: () => void
} {
  const theme = ref<Theme>(readTheme())

  function toggleTheme(): void {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    theme.value = next
    applyThemeClass(next)
    window.localStorage.setItem(STORAGE_THEME, next)
  }

  onMounted(() => {
    applyThemeClass(theme.value)
  })

  return { theme, toggleTheme }
}
