<script setup lang="ts">
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  GripVertical,
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
import type { Episode, Scene } from '@/types/library'

const route = useRoute()
const router = useRouter()
const showSlug = String(route.params.slug ?? '')
const episodeSlug = String(route.params.episodeSlug ?? '')
const episode = ref<Episode | null>(null)
const openIds = ref(new Set<string>())
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

function isOpen(id: string): boolean {
  const open = openIds.value.has(id)
  return open
}

function toggle(id: string): void {
  const next = new Set(openIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  openIds.value = next
}

function cleanScenes(scenes: Scene[]): Scene[] {
  const next = scenes.map((scene) => {
    const row: Scene = {
      id: scene.id,
      slug: scene.slug || slugify(scene.title),
      title: scene.title,
      body: scene.body,
    }
    if (scene.image?.trim()) {
      row.image = scene.image.trim()
    }
    return row
  })
  return next
}

async function load(): Promise<void> {
  const data = await api.episode(showSlug, episodeSlug)
  episode.value = data.episode as Episode
}

async function save(open = false): Promise<void> {
  if (episode.value) {
    try {
      const payload = {
        ...episode.value,
        scenes: cleanScenes(episode.value.scenes),
      }
      const data = await api.saveEpisode(showSlug, episodeSlug, payload)
      episode.value = data.episode as Episode
      notify('success', 'Episode saved')
      if (open) {
        openReader(showSlug, episodeSlug)
        notify('info', 'Opened in reader')
      }
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Save failed')
    }
  }
}

function addScene(): void {
  if (episode.value) {
    const used = new Set(episode.value.scenes.map((scene) => scene.slug))
    let slug = slugify('New scene')
    let n = 2
    while (used.has(slug)) {
      slug = `new-scene-${n}`
      n += 1
    }
    const scene: Scene = {
      id: crypto.randomUUID(),
      slug,
      title: 'New scene',
      body: '',
    }
    episode.value.scenes.push(scene)
    const next = new Set(openIds.value)
    next.add(scene.id)
    openIds.value = next
    notify('info', 'Scene added — save to keep it')
  }
}

async function removeScene(scene: Scene): Promise<void> {
  const ok = await confirmAction({
    title: 'Delete scene',
    body: `Delete “${scene.title}”? This cannot be undone.`,
    confirmLabel: 'Delete',
    tone: 'error',
  })
  if (ok && episode.value) {
    episode.value.scenes = episode.value.scenes.filter((row) => row.id !== scene.id)
    await save(false)
  }
}

async function remove(): Promise<void> {
  const ok = await confirmAction({
    title: 'Delete episode',
    body: 'Delete this episode and all of its scenes? This cannot be undone.',
    confirmLabel: 'Delete',
    tone: 'error',
  })
  if (ok) {
    try {
      await api.deleteEpisode(showSlug, episodeSlug)
      notify('success', 'Episode deleted')
      await router.push({ name: 'show', params: { slug: showSlug } })
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Delete failed')
    }
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
  if (episode.value && from !== null && from !== index) {
    episode.value.scenes = reorder(episode.value.scenes, from, index)
    await save(false)
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
  <div v-if="episode" class="mx-auto max-w-3xl pb-16">
    <div class="mb-6 flex items-center justify-between gap-3">
      <h1 class="text-xl font-medium">{{ episode.title }}</h1>
      <div class="flex flex-wrap gap-2">
        <DeskButton
          :icon="ArrowLeft"
          label="Back"
          :to="`/shows/${showSlug}`"
        />
        <DeskButton :icon="Save" tone="success" label="Save" @click="save(false)" />
        <DeskButton :icon="BookOpen" tone="info" label="Save and open" @click="save(true)" />
        <DeskButton :icon="Trash2" tone="error" label="Delete" @click="remove" />
      </div>
    </div>
    <p class="mb-4 text-sm text-mute">id {{ episode.id }} · updated {{ episode.updatedAt }}</p>
    <div class="mb-8 flex flex-col gap-4">
      <div>
        <label>Title</label>
        <input v-model="episode.title" class="w-full" />
      </div>
      <div>
        <label>Template</label>
        <select v-model="episode.template" class="w-full">
          <option :value="undefined">(inherit / none)</option>
          <option value="spread">spread</option>
          <option value="stack">stack</option>
        </select>
      </div>
    </div>
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-base">Scenes</h2>
      <DeskButton :icon="Plus" tone="success" label="Add scene" @click="addScene" />
    </div>
    <ul class="divide-y divide-line rounded-md border border-line">
      <li
        v-for="(scene, index) in episode.scenes"
        :key="scene.id"
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
            aria-label="Reorder scene"
            @dragstart="onDragStart(index, $event)"
          >
            <GripVertical class="size-4" />
          </button>
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-2 text-left"
            @click="toggle(scene.id)"
          >
            <ChevronDown v-if="isOpen(scene.id)" class="size-4 shrink-0 text-mute" />
            <ChevronRight v-else class="size-4 shrink-0 text-mute" />
            <span class="w-6 shrink-0 text-sm text-mute">{{ index + 1 }}</span>
            <span class="truncate">{{ scene.title }}</span>
            <span class="truncate text-sm text-mute">{{ scene.slug }}</span>
          </button>
          <DeskButton
            :icon="Trash2"
            tone="error"
            label="Delete scene"
            icon-only
            @click="removeScene(scene)"
          />
        </div>
        <div v-if="isOpen(scene.id)" class="flex flex-col gap-3 px-4 pb-4">
          <div>
            <label>Title</label>
            <input v-model="scene.title" class="w-full" />
          </div>
          <PathField
            v-model="scene.image"
            label="Image path"
            :show-slug="showSlug"
            :episode-slug="episodeSlug"
            :list-id="`img-${scene.id}`"
          />
          <div>
            <label>Body</label>
            <textarea v-model="scene.body" class="min-h-40 w-full font-mono text-sm" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
