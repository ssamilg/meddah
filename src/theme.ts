export type Theme = 'light' | 'dark'

const STORAGE_THEME = 'meddah.theme'

function readTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_THEME)
  const theme: Theme = stored === 'light' ? 'light' : 'dark'
  return theme
}

export function applyThemeClass(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export { STORAGE_THEME, readTheme }
