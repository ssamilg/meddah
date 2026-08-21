export const STAGE_TEMPLATES = ['spread', 'stack'] as const

export type StageTemplate = (typeof STAGE_TEMPLATES)[number]

export type ContentStatus = 'draft' | 'ready'

export interface Scene {
  id: string
  slug: string
  title: string
  body: string
  image?: string
}

export interface Episode {
  id: string
  slug: string
  showId: string
  title: string
  template?: StageTemplate
  synthetic?: boolean
  createdAt: string
  updatedAt: string
  scenes: Scene[]
}

export interface ShowEpisodeRef {
  id: string
  slug: string
  title: string
}

export interface Show {
  id: string
  slug: string
  title: string
  summary?: string
  cover?: string
  template?: StageTemplate
  synthetic?: boolean
  status?: ContentStatus
  createdAt: string
  updatedAt: string
  episodes: ShowEpisodeRef[]
}

export interface Catalog {
  shows: Array<{ id: string; slug: string; title: string }>
}

export type Locale = 'tr' | 'en'

export function isStageTemplate(value: unknown): value is StageTemplate {
  const ok = value === 'spread' || value === 'stack'
  return ok
}

export function isContentStatus(value: unknown): value is ContentStatus {
  const ok = value === 'draft' || value === 'ready'
  return ok
}

export function isDraftShow(show: Show | null | undefined): boolean {
  const draft = show?.status === 'draft'
  return draft
}

export function stageTemplate(value: unknown): StageTemplate {
  const template = isStageTemplate(value) ? value : 'spread'
  return template
}

export function resolveTemplate(episode: Episode | null, show: Show | null): StageTemplate {
  const template = stageTemplate(episode?.template ?? show?.template)
  return template
}

function isIsoStamp(value: unknown): boolean {
  const ok = typeof value === 'string' && value.length > 0
  return ok
}

export function isScene(value: unknown): value is Scene {
  const record = value as Record<string, unknown> | null
  const image = record?.image
  const imageOk = image === undefined || typeof image === 'string'
  const ok =
    typeof value === 'object' &&
    value !== null &&
    typeof record?.id === 'string' &&
    typeof record.slug === 'string' &&
    typeof record.title === 'string' &&
    typeof record.body === 'string' &&
    imageOk
  return ok
}

export function isEpisode(value: unknown): value is Episode {
  const record = value as Record<string, unknown> | null
  const scenes = record?.scenes
  const scenesOk = Array.isArray(scenes) && scenes.every(isScene)
  const syntheticOk = record?.synthetic === undefined || typeof record.synthetic === 'boolean'
  const templateOk = record?.template === undefined || isStageTemplate(record.template)
  const ok =
    typeof value === 'object' &&
    value !== null &&
    typeof record?.id === 'string' &&
    typeof record.slug === 'string' &&
    typeof record.showId === 'string' &&
    typeof record.title === 'string' &&
    isIsoStamp(record?.createdAt) &&
    isIsoStamp(record?.updatedAt) &&
    syntheticOk &&
    templateOk &&
    scenesOk
  return ok
}

export function isShow(value: unknown): value is Show {
  const record = value as Record<string, unknown> | null
  const episodes = record?.episodes
  const episodesOk =
    Array.isArray(episodes) &&
    episodes.every((item) => {
      const row = item as Record<string, unknown> | null
      const rowOk =
        typeof item === 'object' &&
        item !== null &&
        typeof row?.id === 'string' &&
        typeof row.slug === 'string' &&
        typeof row.title === 'string'
      return rowOk
    })
  const syntheticOk = record?.synthetic === undefined || typeof record.synthetic === 'boolean'
  const templateOk = record?.template === undefined || isStageTemplate(record.template)
  const coverOk = record?.cover === undefined || typeof record.cover === 'string'
  const summaryOk = record?.summary === undefined || typeof record.summary === 'string'
  const statusOk = record?.status === undefined || isContentStatus(record.status)
  const ok =
    typeof value === 'object' &&
    value !== null &&
    typeof record?.id === 'string' &&
    typeof record.slug === 'string' &&
    typeof record.title === 'string' &&
    isIsoStamp(record?.createdAt) &&
    isIsoStamp(record?.updatedAt) &&
    syntheticOk &&
    templateOk &&
    coverOk &&
    summaryOk &&
    statusOk &&
    episodesOk
  return ok
}

export function isCatalog(value: unknown): value is Catalog {
  const record = value as Record<string, unknown> | null
  const shows = record?.shows
  const showsOk =
    Array.isArray(shows) &&
    shows.every((item) => {
      const row = item as Record<string, unknown> | null
      const rowOk =
        typeof item === 'object' &&
        item !== null &&
        typeof row?.id === 'string' &&
        typeof row.slug === 'string' &&
        typeof row.title === 'string'
      return rowOk
    })
  const ok = typeof value === 'object' && value !== null && showsOk
  return ok
}

export function sceneImage(scene: Scene | undefined): string | undefined {
  const raw = scene?.image?.trim()
  const path = raw === '' ? undefined : raw
  return path
}

export function showSummary(show: Show | undefined): string | undefined {
  const raw = show?.summary?.trim()
  const text = raw === '' ? undefined : raw
  return text
}

export function showCover(show: Show | undefined): string | undefined {
  const raw = show?.cover?.trim()
  const path = raw === '' ? undefined : raw
  return path
}
