export function slugify(value: string): string {
  const out = value
    .trim()
    .toLocaleLowerCase('tr')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
  const slug = out || 'item'
  return slug
}
