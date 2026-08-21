import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import {
  confirmShow,
  createEpisode,
  createShow,
  deleteEpisode,
  deleteShow,
  discardShow,
  saveEpisode,
  saveShow,
} from '../scripts/lib/actions.mjs'
import {
  platesRoot,
  readCatalog,
  readEpisode,
  readShow,
} from '../scripts/lib/content.mjs'

const READER_ORIGIN = 'http://localhost:5173'

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(`${JSON.stringify(body)}\n`)
}

function readBody(req: IncomingMessage): Promise<string> {
  const body = new Promise<string>((resolvePromise, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on('end', () => {
      resolvePromise(Buffer.concat(chunks).toString('utf8'))
    })
    req.on('error', reject)
  })
  return body
}

function isSafeSlug(value: string): boolean {
  const ok = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(value)
  return ok
}

function inside(root: string, target: string): boolean {
  const resolved = resolve(target)
  const ok = resolved === root || resolved.startsWith(`${root}/`)
  return ok
}

function listFiles(dir: string, prefix: string): string[] {
  const out: string[] = []
  if (!existsSync(dir)) {
    return out
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const next = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...listFiles(next, `${prefix}/${entry.name}`))
    } else {
      out.push(`${prefix}/${entry.name}`)
    }
  }
  return out
}

function loadLibrary() {
  const catalog = readCatalog()
  const shows = catalog.shows
    .map((row: { slug: string }) => readShow(row.slug))
    .filter(Boolean)
  const payload = { shows, readerOrigin: READER_ORIGIN }
  return payload
}

async function route(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL,
  method: string,
  path: string,
): Promise<void> {
  const showOne = path.match(/^\/api\/shows\/([^/]+)$/)
  const showAction = path.match(/^\/api\/shows\/([^/]+)\/(confirm|discard|episodes)$/)
  const episodeOne = path.match(/^\/api\/episodes\/([^/]+)\/([^/]+)$/)
  if (method === 'GET' && path === '/api/library') {
    send(res, 200, loadLibrary())
  } else if (method === 'POST' && path === '/api/shows') {
    const body = JSON.parse(await readBody(req))
    send(res, 201, createShow(body))
  } else if (showOne && isSafeSlug(decodeURIComponent(showOne[1] ?? ''))) {
    const slug = decodeURIComponent(showOne[1] ?? '')
    if (method === 'GET') {
      const show = readShow(slug)
      send(res, show ? 200 : 404, show ? { show } : { error: 'not found' })
    } else if (method === 'PUT') {
      const body = JSON.parse(await readBody(req))
      send(res, 200, { show: saveShow({ ...body, slug }) })
    } else if (method === 'DELETE') {
      send(res, 200, deleteShow(slug))
    } else {
      send(res, 404, { error: 'not found' })
    }
  } else if (showAction) {
    const slug = decodeURIComponent(showAction[1] ?? '')
    const action = showAction[2]
    if (!isSafeSlug(slug)) {
      send(res, 400, { error: 'bad slug' })
    } else if (method === 'POST' && action === 'confirm') {
      send(res, 200, { show: confirmShow(slug) })
    } else if (method === 'POST' && action === 'discard') {
      send(res, 200, discardShow(slug))
    } else if (method === 'POST' && action === 'episodes') {
      const body = JSON.parse(await readBody(req))
      send(res, 201, createEpisode({ showSlug: slug, title: body.title, slug: body.slug }))
    } else {
      send(res, 404, { error: 'not found' })
    }
  } else if (episodeOne) {
    const showSlug = decodeURIComponent(episodeOne[1] ?? '')
    const episodeSlug = decodeURIComponent(episodeOne[2] ?? '')
    if (!isSafeSlug(showSlug) || !isSafeSlug(episodeSlug)) {
      send(res, 400, { error: 'bad slug' })
    } else if (method === 'GET') {
      const episode = readEpisode(showSlug, episodeSlug)
      const show = readShow(showSlug)
      send(
        res,
        episode && show ? 200 : 404,
        episode && show ? { episode, show } : { error: 'not found' },
      )
    } else if (method === 'PUT') {
      const body = JSON.parse(await readBody(req))
      send(res, 200, { episode: saveEpisode(showSlug, { ...body, slug: episodeSlug }) })
    } else if (method === 'DELETE') {
      send(res, 200, deleteEpisode(showSlug, episodeSlug))
    } else {
      send(res, 404, { error: 'not found' })
    }
  } else if (method === 'GET' && path === '/api/plates') {
    const showSlug = url.searchParams.get('show') ?? ''
    const episodeSlug = url.searchParams.get('episode') ?? ''
    const dir = episodeSlug ? join(platesRoot, showSlug, episodeSlug) : join(platesRoot, showSlug)
    if (!isSafeSlug(showSlug) || (episodeSlug && !isSafeSlug(episodeSlug))) {
      send(res, 400, { error: 'bad slug' })
    } else if (!inside(platesRoot, dir)) {
      send(res, 400, { error: 'bad path' })
    } else {
      const prefix = episodeSlug ? `/plates/${showSlug}/${episodeSlug}` : `/plates/${showSlug}`
      send(res, 200, { files: listFiles(dir, prefix) })
    }
  } else if (method === 'POST' && path === '/api/upload') {
    const body = JSON.parse(await readBody(req))
    const showSlug = String(body.showSlug ?? '')
    const episodeSlug = body.episodeSlug ? String(body.episodeSlug) : ''
    const filename = basename(String(body.filename ?? 'image'))
    const data = String(body.data ?? '')
    const ext = extname(filename).toLowerCase()
    const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])
    const folder = episodeSlug
      ? join(platesRoot, showSlug, episodeSlug)
      : join(platesRoot, showSlug)
    if (!isSafeSlug(showSlug) || (episodeSlug && !isSafeSlug(episodeSlug))) {
      send(res, 400, { error: 'bad slug' })
    } else if (!allowed.has(ext)) {
      send(res, 400, { error: 'unsupported type' })
    } else if (!inside(platesRoot, folder)) {
      send(res, 400, { error: 'bad path' })
    } else {
      mkdirSync(folder, { recursive: true })
      const binary = Buffer.from(data.replace(/^data:[^;]+;base64,/, ''), 'base64')
      writeFileSync(join(folder, filename), binary)
      const publicPath = episodeSlug
        ? `/plates/${showSlug}/${episodeSlug}/${filename}`
        : `/plates/${showSlug}/${filename}`
      send(res, 201, { path: publicPath })
    }
  } else {
    send(res, 404, { error: 'not found' })
  }
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const raw = req.url ?? '/'
  const url = new URL(raw, 'http://desk.local')
  const path = url.pathname
  const method = req.method ?? 'GET'
  const isApi = path.startsWith('/api/')
  if (isApi) {
    try {
      await route(req, res, url, method, path)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'error'
      send(res, 400, { error: message })
    }
  }
  return isApi
}

export function deskApi(): Plugin {
  const plugin: Plugin = {
    name: 'desk-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handle(req, res).then((hit) => {
          if (!hit) {
            next()
          }
        })
      })
    },
  }
  return plugin
}

