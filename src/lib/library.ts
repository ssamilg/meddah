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

function episodeFromPath(path: string): { showSlug: string; episodeSlug: string } | null {
  const match = path.match(/content\/([^/]+)\/([^/]+)\/episode\.json$/)
  const showSlug = match?.[1]
  const episodeSlug = match?.[2]
  const pair = showSlug && episodeSlug ? { showSlug, episodeSlug } : null
  return pair
}

export function loadCatalog(): Catalog {
  const catalog = isCatalog(catalogJson) ? catalogJson : { shows: [] }
  return catalog
}

export function loadShow(slug: string): Show | null {
  let found: Show | null = null
  for (const [path, mod] of Object.entries(showModules)) {
    const folder = showFromPath(path)
    const data = moduleData(mod)
    if (isShow(data) && (data.slug === slug || folder === slug)) {
      found = data
    }
  }
  return found
}

export function loadEpisode(showSlug: string, episodeSlug: string): Episode | null {
  let found: Episode | null = null
  for (const [path, mod] of Object.entries(episodeModules)) {
    const pair = episodeFromPath(path)
    const data = moduleData(mod)
    if (
      pair &&
      pair.showSlug === showSlug &&
      pair.episodeSlug === episodeSlug &&
      isEpisode(data)
    ) {
      found = data
    }
  }
  return found
}

function loadEpisodesForShow(showSlug: string): Episode[] {
  const list: Episode[] = []
  for (const [path, mod] of Object.entries(episodeModules)) {
    const pair = episodeFromPath(path)
    const data = moduleData(mod)
    if (pair && pair.showSlug === showSlug && isEpisode(data)) {
      list.push(data)
    }
  }
  return list
}

export function loadLibrary(): Show[] {
  const catalog = loadCatalog()
  const shows: Show[] = []
  for (const entry of catalog.shows) {
    const show = loadShow(entry.slug)
    if (!show || show.status === 'draft') {
      continue
    }
    const loaded = loadEpisodesForShow(show.slug)
    const byId = new Map(loaded.map((episode) => [episode.id, episode]))
    const bySlug = new Map(loaded.map((episode) => [episode.slug, episode]))
    const ordered: Show['episodes'] = []
    const seen = new Set<string>()
    for (const ref of show.episodes) {
      const episode = byId.get(ref.id) ?? bySlug.get(ref.slug)
      if (episode && !seen.has(episode.id)) {
        ordered.push({ id: episode.id, slug: episode.slug, title: episode.title })
        seen.add(episode.id)
      }
    }
    for (const episode of loaded) {
      if (!seen.has(episode.id)) {
        ordered.push({ id: episode.id, slug: episode.slug, title: episode.title })
        seen.add(episode.id)
      }
    }
    shows.push({ ...show, episodes: ordered })
  }
  return shows
}
