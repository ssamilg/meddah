<script setup lang="ts">
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
} from '@lucide/vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DeskButton from '@desk/components/DeskButton.vue'
import PathField from '@desk/components/PathField.vue'
import { api, openReader } from '@desk/api'
import { confirmAction, notify, reorder } from '@desk/feedback'
import { slugify } from '@desk/slug'
import { formatStamp } from '@desk/stamp'
import type { Episode, Show, ShowEpisodeRef } from '@/types/library'

const route = useRoute()
const router = useRouter()
const slug = String(route.params.slug ?? '')
const show = ref<Show | null>(null)
const epTitle = ref('')
const openIds = ref(new Set<string>())
const drafts = ref<Record<string, Episode>>({})
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

function isOpen(id: string): boolean {
  const open = openIds.value.has(id)
  return open
}

async function toggle(episode: ShowEpisodeRef): Promise<void> {
  const next = new Set(openIds.value)
  if (next.has(episode.id)) {
    next.delete(episode.id)
  } else {
    next.add(episode.id)
    if (!drafts.value[episode.id]) {
      try {
        const data = await api.episode(slug, episode.slug)
        drafts.value = { ...drafts.value, [episode.id]: data.episode as Episode }
      } catch (err) {
        next.delete(episode.id)
        notify('error', err instanceof Error ? err.message : 'Load failed')
      }
    }
  }
  openIds.value = next
}

async function saveEpisodeDraft(episode: ShowEpisodeRef): Promise<void> {
  const draft = drafts.value[episode.id]
  if (draft) {
    try {
      const data = await api.saveEpisode(slug, episode.slug, draft)
      const saved = data.episode as Episode
      drafts.value = { ...drafts.value, [episode.id]: saved }
      if (show.value) {
        show.value.episodes = show.value.episodes.map((row) => {
          const item = row.id === episode.id ? { ...row, title: saved.title } : row
          return item
        })
      }
      notify('success', 'Episode saved')
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Save failed')
    }
  }
}

function draftTitle(id: string): string {
  const title = drafts.value[id]?.title ?? ''
  return title
}

function draftTemplate(id: string): string {
  const value = drafts.value[id]?.template ?? ''
  return value
}

function onDraftTitle(id: string, event: Event): void {
  const draft = drafts.value[id]
  const target = event.target as HTMLInputElement
  if (draft) {
    draft.title = target.value
  }
}

function onDraftTemplate(id: string, event: Event): void {
  const draft = drafts.value[id]
  const target = event.target as HTMLSelectElement
  if (draft) {
    if (target.value === 'spread' || target.value === 'stack') {
      draft.template = target.value
    } else {
      delete draft.template
    }
  }
}

async function load(): Promise<void> {
  const data = await api.show(slug)
  show.value = data.show as Show
}

async function save(): Promise<void> {
  if (show.value) {
    try {
      const data = await api.saveShow(slug, show.value)
      show.value = data.show as Show
      notify('success', 'Show saved')
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Save failed')
    }
  }
}

async function addEpisode(): Promise<void> {
  if (epTitle.value) {
    try {
      const result = await api.createEpisode(slug, {
        title: epTitle.value,
        slug: slugify(epTitle.value),
      })
      const created = result.episode as { slug: string }
      notify('success', 'Episode created')
      await router.push({ name: 'episode', params: { slug, episodeSlug: created.slug } })
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Create failed')
    }
  }
}

async function remove(): Promise<void> {
  const ok = await confirmAction({
    title: 'Delete show',
    body: 'Delete this show and all of its episodes? This cannot be undone.',
    confirmLabel: 'Delete',
    tone: 'error',
  })
  if (ok) {
    try {
      await api.deleteShow(slug)
      notify('success', 'Show deleted')
      await router.push({ name: 'home' })
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Delete failed')
    }
  }
}

async function removeEpisode(episode: ShowEpisodeRef): Promise<void> {
  const ok = await confirmAction({
    title: 'Delete episode',
    body: `Delete “${episode.title}”? This cannot be undone.`,
    confirmLabel: 'Delete',
    tone: 'error',
  })
  if (ok && show.value) {
    try {
      await api.deleteEpisode(slug, episode.slug)
      await load()
      notify('success', 'Episode deleted')
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Delete failed')
    }
  }
}

function openFirst(): void {
  const first = show.value?.episodes[0]
  if (first) {
    openReader(slug, first.slug)
    notify('info', 'Opened in reader')
  }
}

function onDragStart(index: number, event: DragEvent): void {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index: number, event: DragEvent): void {
  event.preventDefault()
  overIndex.value = index
}

async function onDrop(index: number): Promise<void> {
  const from = dragIndex.value
  if (show.value && from !== null && from !== index) {
    show.value.episodes = reorder(show.value.episodes, from, index)
    await save()
  }
  dragIndex.value = null
  overIndex.value = null
}

function onDragEnd(): void {
  dragIndex.value = null
  overIndex.value = null
}

onMounted(() => {
  load().catch((err: Error) => {
    notify('error', err.message)
  })
})
</script>

<template>
  <div v-if="show" class="mx-auto max-w-2xl">
    <div class="mb-6 flex items-center justify-between gap-3">
      <h1 class="text-xl font-medium">{{ show.title }}</h1>
      <div class="flex flex-wrap gap-2">
        <DeskButton :icon="Save" tone="success" label="Save" @click="save" />
        <DeskButton
          :icon="BookOpen"
          tone="info"
          label="Open reader"
          :disabled="!show.episodes[0]"
          @click="openFirst"
        />
        <DeskButton :icon="Trash2" tone="error" label="Delete" @click="remove" />
      </div>
    </div>
    <div class="mb-4 text-sm text-mute">
      <span v-if="show.status === 'draft'" class="text-warning">Draft · </span>
      created {{ formatStamp(show.createdAt) }} · updated {{ formatStamp(show.updatedAt) }}
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <label>Title</label>
        <input v-model="show.title" class="w-full" />
      </div>
      <div>
        <label>Template</label>
        <select v-model="show.template" class="w-full">
          <option :value="undefined">(none)</option>
          <option value="spread">spread</option>
          <option value="stack">stack</option>
        </select>
      </div>
      <PathField v-model="show.cover" label="Cover" :show-slug="slug" list-id="show-cover" />
    </div>
    <h2 class="mt-8 mb-3 text-base">Episodes</h2>
    <ul class="mb-6 divide-y divide-line rounded-md border border-line">
      <li
        v-for="(episode, index) in show.episodes"
        :key="episode.id"
        class="bg-paper"
        :class="overIndex === index ? 'ring-1 ring-info' : ''"
        @dragover="onDragOver(index, $event)"
        @drop.prevent="onDrop(index)"
        @dragend="onDragEnd"
      >
        <div class="flex items-center gap-2 px-2 py-2">
          <button
            type="button"
            class="btn btn-ghost btn-xs cursor-grab text-mute"
            draggable="true"
            aria-label="Reorder episode"
            @dragstart="onDragStart(index, $event)"
          >
            <GripVertical class="size-4" />
          </button>
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-2 text-left"
            @click="toggle(episode)"
          >
            <ChevronDown v-if="isOpen(episode.id)" class="size-4 shrink-0 text-mute" />
            <ChevronRight v-else class="size-4 shrink-0 text-mute" />
            <span class="truncate">{{ episode.title }}</span>
          </button>
          <div class="flex shrink-0 flex-wrap gap-1" @click.stop>
            <DeskButton
              :icon="Pencil"
              tone="info"
              label="Edit"
              :to="`/shows/${slug}/episodes/${episode.slug}`"
            />
            <DeskButton
              :icon="BookOpen"
              tone="white"
              label="Open"
              @click="openReader(slug, episode.slug)"
            />
            <DeskButton
              :icon="Trash2"
              tone="error"
              label="Delete"
              @click="removeEpisode(episode)"
            />
          </div>
        </div>
        <div v-if="isOpen(episode.id)" class="flex flex-col gap-3 px-4 pb-4">
          <template v-if="drafts[episode.id]">
            <div>
              <label>Title</label>
              <input
                class="w-full"
                :value="draftTitle(episode.id)"
                @input="onDraftTitle(episode.id, $event)"
              />
            </div>
            <div>
              <label>Template</label>
              <select
                class="w-full"
                :value="draftTemplate(episode.id)"
                @change="onDraftTemplate(episode.id, $event)"
              >
                <option value="">(inherit / none)</option>
                <option value="spread">spread</option>
                <option value="stack">stack</option>
              </select>
            </div>
            <DeskButton
              :icon="Save"
              tone="success"
              label="Save episode"
              @click="saveEpisodeDraft(episode)"
            />
          </template>
          <p v-else class="text-sm text-mute">Loading…</p>
        </div>
      </li>
    </ul>
    <form class="flex flex-wrap gap-2" @submit.prevent="addEpisode">
      <input v-model="epTitle" placeholder="Episode title" class="flex-1" />
      <DeskButton :icon="Plus" tone="success" type="submit" label="Add" />
    </form>
  </div>
</template>
