export interface Scene {
  id: string
  title: string
  body: string
  image: string
}

export interface Piece {
  id: string
  title: string
  synthetic: boolean
  scenes: Scene[]
}

export type Locale = 'tr' | 'en'

export function isScene(value: unknown): value is Scene {
  const record = value as Record<string, unknown> | null
  const ok =
    typeof value === 'object' &&
    value !== null &&
    typeof record?.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.body === 'string' &&
    typeof record.image === 'string'
  return ok
}

export function isPiece(value: unknown): value is Piece {
  const record = value as Record<string, unknown> | null
  const scenes = record?.scenes
  const scenesOk = Array.isArray(scenes) && scenes.every(isScene)
  const ok =
    typeof value === 'object' &&
    value !== null &&
    typeof record?.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.synthetic === 'boolean' &&
    scenesOk
  return ok
}
