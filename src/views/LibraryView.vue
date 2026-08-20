<script setup lang="ts">
import { loadLibrary } from '@/lib/library'
import { uiCopy } from '@/i18n'
import { useLocale } from '@/composables/useLocale'
import { computed } from 'vue'

const { locale } = useLocale()
const copy = computed(() => uiCopy(locale.value))
const shows = loadLibrary()
</script>

<template>
  <div class="flex flex-1 justify-center px-4 py-10">
    <div class="w-full max-w-xl">
      <h1 class="mb-6 text-xl font-medium">{{ copy.library }}</h1>
      <section v-for="show in shows" :key="show.id" class="mb-8">
        <h2 class="mb-2 text-base text-mute">
          {{ show.title }}
          <span v-if="show.synthetic" class="ml-2 text-sm">{{ copy.synthetic }}</span>
        </h2>
        <ul>
          <li v-for="episode in show.episodes" :key="episode.id">
            <RouterLink
              :to="{ name: 'read', params: { showId: show.id, episodeId: episode.id } }"
              class="block cursor-pointer py-1.5 text-ink hover:text-mute"
            >
              {{ episode.title }}
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
