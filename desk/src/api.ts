export const READER_ORIGIN = 'http://localhost:5173'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const data = (await response.json()) as T & { error?: string }
  if (!response.ok) {
    throw new Error(data.error || response.statusText)
  }
  return data
}

export function readerUrl(showSlug: string, episodeSlug: string): string {
  const url = `${READER_ORIGIN}/read/${showSlug}/${episodeSlug}`
  return url
}

export function openReader(showSlug: string, episodeSlug: string): void {
  window.open(readerUrl(showSlug, episodeSlug), '_blank')
}

export const api = {
  library: () => request<{ shows: unknown[]; readerOrigin: string }>('/api/library'),
  show: (slug: string) => request<{ show: unknown }>(`/api/shows/${slug}`),
  createShow: (body: unknown) =>
    request<{ show: unknown; files: string[] }>('/api/shows', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  saveShow: (slug: string, body: unknown) =>
    request<{ show: unknown }>(`/api/shows/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteShow: (slug: string) => request<{ slug: string }>(`/api/shows/${slug}`, { method: 'DELETE' }),
  confirmShow: (slug: string) =>
    request<{ show: unknown }>(`/api/shows/${slug}/confirm`, { method: 'POST' }),
  discardShow: (slug: string) =>
    request<{ slug: string }>(`/api/shows/${slug}/discard`, { method: 'POST' }),
  createEpisode: (showSlug: string, body: unknown) =>
    request<{ episode: unknown; files: string[] }>(`/api/shows/${showSlug}/episodes`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  episode: (showSlug: string, episodeSlug: string) =>
    request<{ episode: unknown; show: unknown }>(`/api/episodes/${showSlug}/${episodeSlug}`),
  saveEpisode: (showSlug: string, episodeSlug: string, body: unknown) =>
    request<{ episode: unknown }>(`/api/episodes/${showSlug}/${episodeSlug}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteEpisode: (showSlug: string, episodeSlug: string) =>
    request<{ slug: string }>(`/api/episodes/${showSlug}/${episodeSlug}`, { method: 'DELETE' }),
  plates: (show: string, episode?: string) => {
    const query = episode
      ? `/api/plates?show=${encodeURIComponent(show)}&episode=${encodeURIComponent(episode)}`
      : `/api/plates?show=${encodeURIComponent(show)}`
    return request<{ files: string[] }>(query)
  },
  upload: (body: {
    showSlug: string
    episodeSlug?: string
    filename: string
    data: string
  }) => request<{ path: string }>('/api/upload', { method: 'POST', body: JSON.stringify(body) }),
}
