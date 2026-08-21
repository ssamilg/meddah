const STORAGE_LANDING = 'meddah.landingSeen'

export function hasSeenLanding(): boolean {
  const stored = window.localStorage.getItem(STORAGE_LANDING)
  const seen = stored === '1'
  return seen
}

export function markLandingSeen(): void {
  window.localStorage.setItem(STORAGE_LANDING, '1')
}

export { STORAGE_LANDING }
