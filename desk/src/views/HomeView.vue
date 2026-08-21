<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import DeskButton from '@desk/components/DeskButton.vue'
import { api } from '@desk/api'
import { confirmAction, notify } from '@desk/feedback'
import type { Show } from '@/types/library'

const shows = ref<Show[]>([])

async function load(): Promise<void> {
  const data = await api.library()
  shows.value = data.shows as Show[]
}

async function remove(show: Show): Promise<void> {
  const ok = await confirmAction({
    title: 'Delete show',
    body: `Delete “${show.title}” and all of its episodes? This cannot be undone.`,
    confirmLabel: 'Delete',
    tone: 'error',
  })
  if (ok) {
    try {
      await api.deleteShow(show.slug)
      await load()
      notify('success', 'Show deleted')
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Delete failed')
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
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-medium">Shows</h1>
      <DeskButton :icon="Plus" tone="info" label="New show" to="/new" />
    </div>
    <ul class="divide-y divide-line">
      <li v-for="show in shows" :key="show.id" class="flex items-center justify-between py-2">
        <div>
          <RouterLink :to="`/shows/${show.slug}`" class="hover:text-mute">
            {{ show.title }}
          </RouterLink>
          <p class="text-sm text-mute">
            {{ show.slug }}
            <span v-if="show.status === 'draft'"> · draft</span>
          </p>
        </div>
        <DeskButton :icon="Trash2" tone="error" label="Delete" @click="remove(show)" />
      </li>
    </ul>
  </div>
</template>
