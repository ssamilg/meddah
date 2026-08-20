import { onMounted, ref, type Ref } from 'vue'
import { applyThemeClass, readTheme, STORAGE_THEME, type Theme } from '@/theme'

const theme = ref<Theme>('dark')

export function useTheme(): {
  theme: Ref<Theme>
  toggleTheme: () => void
} {
  function toggleTheme(): void {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    theme.value = next
    applyThemeClass(next)
    window.localStorage.setItem(STORAGE_THEME, next)
  }

  onMounted(() => {
    theme.value = readTheme()
    applyThemeClass(theme.value)
  })

  return { theme, toggleTheme }
}
