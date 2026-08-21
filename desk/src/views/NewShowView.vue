<script setup lang="ts">
import { Play } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DeskButton from '@desk/components/DeskButton.vue'
import { api } from '@desk/api'
import { notify } from '@desk/feedback'
import { slugify } from '@desk/slug'

const router = useRouter()
const title = ref('')
const template = ref<'spread' | 'stack' | ''>('')
const cover = ref('')
const summary = ref('')
const busy = ref(false)
const slug = computed(() => slugify(title.value))

async function create(): Promise<void> {
  busy.value = true
  try {
    const result = await api.createShow({
      title: title.value,
      slug: slug.value,
      template: template.value || undefined,
      cover: cover.value || undefined,
      summary: summary.value || undefined,
    })
    const created = result.show as { slug: string }
    notify('success', 'Scaffold created')
    await router.push({ name: 'review', params: { slug: created.slug } })
  } catch (err) {
    notify('error', err instanceof Error ? err.message : 'failed')
  }
  busy.value = false
}
</script>

<template>
  <div class="mx-auto max-w-lg">
    <h1 class="mb-6 text-xl font-medium">New show</h1>
    <p class="mb-6 text-sm text-mute">
      Folder name is generated from the title: lowercase, hyphens, letters and numbers.
    </p>
    <form class="flex flex-col gap-4" @submit.prevent="create">
      <div>
        <label>Title</label>
        <input v-model="title" class="w-full" required />
        <p v-if="title" class="mt-1 text-sm text-mute">{{ slug }}</p>
      </div>
      <div>
        <label>Template</label>
        <select v-model="template" class="w-full">
          <option value="">(none)</option>
          <option value="spread">spread</option>
          <option value="stack">stack</option>
        </select>
      </div>
      <div>
        <label>Summary</label>
        <textarea v-model="summary" class="min-h-24 w-full" />
      </div>
      <div>
        <label>Cover path</label>
        <input v-model="cover" class="w-full" placeholder="/plates/… or https://…" />
      </div>
      <DeskButton :icon="Play" tone="info" type="submit" label="Run script" :disabled="busy" />
    </form>
  </div>
</template>
