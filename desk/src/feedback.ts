import { ref } from 'vue'

export type Tone = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  tone: Tone
  message: string
}

export interface ConfirmRequest {
  title: string
  body: string
  confirmLabel: string
  tone: 'error' | 'warning'
}

export const toasts = ref<ToastItem[]>([])
export const confirmOpen = ref<ConfirmRequest | null>(null)

let confirmWait: ((ok: boolean) => void) | null = null

export function notify(tone: Tone, message: string): void {
  const id = crypto.randomUUID()
  toasts.value = [...toasts.value, { id, tone, message }]
  window.setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }, 3200)
}

export function dismissToast(id: string): void {
  toasts.value = toasts.value.filter((item) => item.id !== id)
}

export function confirmAction(request: ConfirmRequest): Promise<boolean> {
  confirmOpen.value = request
  const result = new Promise<boolean>((resolve) => {
    confirmWait = resolve
  })
  return result
}

export function resolveConfirm(ok: boolean): void {
  const wait = confirmWait
  confirmWait = null
  confirmOpen.value = null
  if (wait) {
    wait(ok)
  }
}

export function reorder<T>(list: T[], from: number, to: number): T[] {
  const next = [...list]
  const [row] = next.splice(from, 1)
  if (row) {
    next.splice(to, 0, row)
  }
  return next
}
