const held = new Map<string, HTMLImageElement>()

export function prefetchPlate(src: string | undefined): void {
  if (src && !held.has(src)) {
    const img = new Image()
    img.decoding = 'async'
    img.fetchPriority = 'low'
    img.src = src
    held.set(src, img)
  }
}

export function prefetchPlates(srcs: Array<string | undefined>): void {
  for (const src of srcs) {
    prefetchPlate(src)
  }
}

export function plateReady(src: string | undefined): boolean {
  const img = src ? held.get(src) : undefined
  const ready = Boolean(img && img.complete && img.naturalWidth > 0)
  return ready
}
