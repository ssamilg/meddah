import catalogJson from '../../content/catalog.json'
import {
  isCatalog,
  isEpisode,
  isShow,
  type Catalog,
  type Episode,
  type Show,
} from '@/types/library'

const showModules = import.meta.glob('../../content/*/show.json', { eager: true })
const episodeModules = import.meta.glob('../../content/*/*/episode.json', { eager: true })

function moduleData(mod: unknown): unknown {
  const record = mod as { default?: unknown } | null
  const data = record && typeof record === 'object' && 'default' in record ? record.default : mod
  return data
}

function showFromPath(path: string): string | null {
  const match = path.match(/content\/([^/]+)\/show\.json$/)
  return match?.[1] ?? null
}

function episodeFromPath(path: string): { showId: string; episodeId: string } | null {
  const match = path.match(/content\/([^/]+)\/([^/]+)\/episode\.json$/)
  const pair = match ? { showId: match[1], episodeId: match[2] } : null
  return pair
}

export function loadCatalog(): Catalog {
  const catalog = isCatalog(catalogJson) ? catalogJson : { shows: [] }
  return catalog
}

export function loadShow(showId: string): Show | null {
  let found: Show | null = null
  for (const [path, mod] of Object.entries(showModules)) {
    const id = showFromPath(path)
    const data = moduleData(mod)
    if (id === showId && isShow(data)) {
      found = data
    }
  }
  return found
}

export function loadEpisode(showId: string, episodeId: string): Episode | null {
  let found: Episode | null = null
  for (const [path, mod] of Object.entries(episodeModules)) {
    const pair = episodeFromPath(path)
    const data = moduleData(mod)
    if (pair && pair.showId === showId && pair.episodeId === episodeId && isEpisode(data)) {
      found = data
    }
  }
  return found
}

function loadEpisodesForShow(showId: string): Episode[] {
  const list: Episode[] = []
  for (const [path, mod] of Object.entries(episodeModules)) {
    const pair = episodeFromPath(path)
    const data = moduleData(mod)
    if (pair && pair.showId === showId && isEpisode(data)) {
      list.push(data)
    }
  }
  return list
}

export function loadLibrary(): Show[] {
  const catalog = loadCatalog()
  const shows: Show[] = []
  for (const entry of catalog.shows) {
    const show = loadShow(entry.id)
    if (!show) {
      continue
    }
    const loaded = loadEpisodesForShow(show.id)
    const byId = new Map(loaded.map((episode) => [episode.id, episode]))
    const ordered: Show['episodes'] = []
    const seen = new Set<string>()
    for (const ref of show.episodes) {
      const episode = byId.get(ref.id)
      ordered.push({ id: ref.id, title: episode?.title ?? ref.title })
      seen.add(ref.id)
    }
    for (const episode of loaded) {
      if (!seen.has(episode.id)) {
        ordered.push({ id: episode.id, title: episode.title })
      }
    }
    shows.push({ ...show, episodes: ordered })
  }
  return shows
}
