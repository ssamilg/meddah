function pad(value: number): string {
  const out = String(value).padStart(2, '0')
  return out
}

export function formatStamp(value: string): string {
  const date = new Date(value)
  let out = value
  if (!Number.isNaN(date.getTime())) {
    const dd = pad(date.getDate())
    const mm = pad(date.getMonth() + 1)
    const yy = String(date.getFullYear()).slice(-2)
    const hh = pad(date.getHours())
    const min = pad(date.getMinutes())
    out = `${dd}/${mm}/${yy} ${hh}:${min}`
  }
  return out
}
