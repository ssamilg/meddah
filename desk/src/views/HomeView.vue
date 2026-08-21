<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DeskButton from '@desk/components/DeskButton.vue'
import { api } from '@desk/api'
import { notify } from '@desk/feedback'
import { formatStamp } from '@desk/stamp'
import type { Show } from '@/types/library'

type DateSort = 'updated-desc' | 'updated-asc' | 'created-desc' | 'created-asc'

const router = useRouter()
const shows = ref<Show[]>([])
const query = ref('')
const sort = ref<DateSort>('updated-desc')

const rows = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase('tr')
  const filtered = shows.value.filter((show) => {
    const title = show.title.toLocaleLowerCase('tr')
    const hit = needle === '' || title.includes(needle)
    return hit
  })
  const field = sort.value.startsWith('updated') ? 'updatedAt' : 'createdAt'
  const dir = sort.value.endsWith('desc') ? -1 : 1
  const next = [...filtered].sort((a, b) => {
    const cmp = a[field].localeCompare(b[field]) * dir
    return cmp
  })
  return next
})

async function load(): Promise<void> {
  const data = await api.library()
  shows.value = data.shows as Show[]
}

function openShow(show: Show): void {
  void router.push({ name: 'show', params: { slug: show.slug } })
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
    <div class="mb-4 flex flex-wrap gap-2">
      <input v-model="query" class="min-w-56 flex-1" placeholder="Search names" />
      <select v-model="sort" class="w-52">
        <option value="updated-desc">Updated · newest</option>
        <option value="updated-asc">Updated · oldest</option>
        <option value="created-desc">Created · newest</option>
        <option value="created-asc">Created · oldest</option>
      </select>
    </div>
    <div class="overflow-x-auto rounded-md border border-line">
      <table class="w-full text-left text-sm">
        <thead class="text-mute">
          <tr class="border-b border-line">
            <th class="px-3 py-2 font-medium">Name</th>
            <th class="px-3 py-2 font-medium">Episodes</th>
            <th class="px-3 py-2 font-medium">Created</th>
            <th class="px-3 py-2 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="show in rows"
            :key="show.id"
            class="cursor-pointer border-b border-line last:border-b-0 hover:bg-paper"
            @click="openShow(show)"
          >
            <td class="px-3 py-2">
              {{ show.title }}
              <span v-if="show.status === 'draft'" class="ml-2 text-warning">draft</span>
            </td>
            <td class="px-3 py-2 text-mute">{{ show.episodes.length }}</td>
            <td class="px-3 py-2 text-mute">{{ formatStamp(show.createdAt) }}</td>
            <td class="px-3 py-2 text-mute">{{ formatStamp(show.updatedAt) }}</td>
          </tr>
          <tr v-if="rows.length === 0">
            <td class="px-3 py-6 text-mute" colspan="4">No shows</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
