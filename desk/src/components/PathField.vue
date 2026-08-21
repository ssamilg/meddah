<script setup lang="ts">
import { FolderOpen } from '@lucide/vue'
import { onMounted, ref, watch } from 'vue'
import { api } from '@desk/api'
import { notify } from '@desk/feedback'

const model = defineModel<string | undefined>({ default: '' })

const props = defineProps<{
  label: string
  showSlug: string
  episodeSlug?: string
  listId?: string
}>()

const files = ref<string[]>([])
const picking = ref(false)

async function loadFiles(): Promise<void> {
  if (!props.showSlug) {
    files.value = []
  } else {
    try {
      const data = await api.plates(props.showSlug, props.episodeSlug)
      files.value = data.files
    } catch {
      files.value = []
    }
  }
}

async function onFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && props.showSlug) {
    picking.value = true
    try {
      const data = await new Promise<string>((resolvePromise, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolvePromise(String(reader.result ?? ''))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })
      const uploaded = await api.upload({
        showSlug: props.showSlug,
        ...(props.episodeSlug ? { episodeSlug: props.episodeSlug } : {}),
        filename: file.name,
        data,
      })
      model.value = uploaded.path
      await loadFiles()
      notify('success', 'Image added')
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Upload failed')
    }
    picking.value = false
    input.value = ''
  }
}

onMounted(() => {
  void loadFiles()
})

watch(
  () => [props.showSlug, props.episodeSlug],
  () => {
    void loadFiles()
  },
)
</script>

<template>
  <div>
    <label>{{ label }}</label>
    <div class="flex flex-wrap gap-2">
      <input v-model="model" class="min-w-48 flex-1" :list="listId ?? 'plate-paths'" />
      <label class="btn btn-sm btn-outline btn-info gap-1.5">
        <FolderOpen class="size-4" />
        {{ picking ? '…' : 'Pick file' }}
        <input type="file" accept="image/*" class="hidden" @change="onFile" />
      </label>
    </div>
    <datalist :id="listId ?? 'plate-paths'">
      <option v-for="file in files" :key="file" :value="file" />
    </datalist>
  </div>
</template>
