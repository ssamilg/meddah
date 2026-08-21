<script setup lang="ts">
import { Check, Trash2 } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DeskButton from '@desk/components/DeskButton.vue'
import { api } from '@desk/api'
import { confirmAction, notify } from '@desk/feedback'
import type { Show } from '@/types/library'

const route = useRoute()
const router = useRouter()
const show = ref<Show | null>(null)
const files = ref<string[]>([])
const slug = String(route.params.slug ?? '')

async function load(): Promise<void> {
  const data = await api.show(slug)
  show.value = data.show as Show
  files.value = [`content/${slug}/show.json`, `public/plates/${slug}/`]
}

async function confirm(): Promise<void> {
  try {
    await api.confirmShow(slug)
    notify('success', 'Show approved')
    await router.push({ name: 'show', params: { slug } })
  } catch (err) {
    notify('error', err instanceof Error ? err.message : 'Approve failed')
  }
}

async function discard(): Promise<void> {
  const ok = await confirmAction({
    title: 'Discard scaffold',
    body: 'Delete the files the script just created?',
    confirmLabel: 'Discard',
    tone: 'warning',
  })
  if (ok) {
    try {
      await api.discardShow(slug)
      notify('warning', 'Scaffold discarded')
      await router.push({ name: 'home' })
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Discard failed')
    }
  }
}

onMounted(() => {
  load().catch((err: Error) => {
    notify('error', err.message)
  })
})
</script>

<template>
  <div class="mx-auto max-w-lg">
    <h1 class="mb-2 text-xl font-medium">Approve scaffold</h1>
    <p v-if="show" class="mb-4 text-mute">{{ show.title }} · {{ show.slug }}</p>
    <ul class="mb-6 font-mono text-sm text-mute">
      <li v-for="file in files" :key="file">{{ file }}</li>
    </ul>
    <div class="flex gap-3">
      <DeskButton :icon="Check" tone="success" label="Approve and edit" @click="confirm" />
      <DeskButton :icon="Trash2" tone="warning" label="Discard" @click="discard" />
    </div>
  </div>
</template>
