import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { Config } from '@netlify/functions'

const PREFIX = 'plates/'

let client: S3Client | undefined

function plateKeyFromPath(pathname: string): string | null {
  let key: string | null = null
  try {
    const decoded = decodeURIComponent(pathname)
    const trimmed = decoded.startsWith('/') ? decoded.slice(1) : decoded
    const traversal = trimmed.includes('..') || trimmed.includes('\\')
    const nested = trimmed.startsWith(PREFIX) && trimmed.length > PREFIX.length
    if (!traversal && nested) {
      key = trimmed
    }
  } catch {
    key = null
  }
  return key
}

function plateKey(request: Request): string | null {
  const url = new URL(request.url)
  let key = plateKeyFromPath(url.pathname)
  const splat = url.searchParams.get('key')
  if (!key && splat) {
    key = plateKeyFromPath(`/${PREFIX}${splat}`)
  }
  return key
}

function r2Client(): S3Client | undefined {
  const accountId = process.env.R2_ACCOUNT_ID ?? ''
  const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? ''
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? ''
  let next = client
  if (!next && accountId && accessKeyId && secretAccessKey) {
    next = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    })
    client = next
  }
  return next
}

function objectHeaders(meta: {
  ContentType?: string
  ContentLength?: number
  ETag?: string
}): Headers {
  const headers = new Headers()
  headers.set('Cache-Control', 'private, max-age=86400')
  if (meta.ContentType) {
    headers.set('Content-Type', meta.ContentType)
  }
  if (typeof meta.ContentLength === 'number') {
    headers.set('Content-Length', String(meta.ContentLength))
  }
  if (meta.ETag) {
    headers.set('ETag', meta.ETag)
  }
  return headers
}

function statusFor(error: unknown): Response {
  const name = error instanceof Error ? error.name : ''
  const notFound = name === 'NoSuchKey' || name === 'NotFound'
  const response = new Response(null, { status: notFound ? 404 : 502 })
  return response
}

export default async (request: Request): Promise<Response> => {
  let response: Response
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response = new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } })
  } else {
    const key = plateKey(request)
    const r2 = r2Client()
    const bucket = process.env.R2_BUCKET ?? ''
    if (!key) {
      response = new Response(null, { status: 404 })
    } else if (!r2 || !bucket) {
      response = new Response(null, { status: 500 })
    } else {
      try {
        const input = { Bucket: bucket, Key: key }
        if (request.method === 'HEAD') {
          const object = await r2.send(new HeadObjectCommand(input))
          response = new Response(null, { status: 200, headers: objectHeaders(object) })
        } else {
          const object = await r2.send(new GetObjectCommand(input))
          const body = object.Body ? object.Body.transformToWebStream() : null
          response = new Response(body, { status: 200, headers: objectHeaders(object) })
        }
      } catch (error) {
        response = statusFor(error)
      }
    }
  }
  return response
}

export const config: Config = {
  method: ['GET', 'HEAD'],
}
