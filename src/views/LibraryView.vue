<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadLibrary } from '@/lib/library'
import { uiCopy } from '@/i18n'
import { useLocale } from '@/composables/useLocale'
import { showCover, showSummary, type Show } from '@/types/library'

const router = useRouter()
const { locale } = useLocale()
const copy = computed(() => uiCopy(locale.value))
const shows = loadLibrary()
const selectedId = ref(shows[0]?.id ?? '')

const selected = computed(() => {
  const current = shows.find((show) => show.id === selectedId.value)
  const show = current ?? shows[0] ?? null
  return show
})

const coverSrc = computed(() => showCover(selected.value ?? undefined))
const summary = computed(() => showSummary(selected.value ?? undefined))
const firstEpisode = computed(() => selected.value?.episodes[0] ?? null)

function selectShow(id: string): void {
  selectedId.value = id
}

function move(delta: number): void {
  const count = shows.length
  if (count > 0) {
    const i = shows.findIndex((show) => show.id === selectedId.value)
    const from = i >= 0 ? i : 0
    const next = (from + delta + count) % count
    const show = shows[next]
    if (show) {
      selectedId.value = show.id
    }
  }
}

function openFirst(show: Show | null): void {
  const episode = show?.episodes[0]
  if (show && episode) {
    void router.push({
      name: 'read',
      params: { showSlug: show.slug, episodeSlug: episode.slug },
    })
  }
}

function onKey(event: KeyboardEvent): void {
  const target = event.target
  const typing =
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable)
  if (!typing) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'Enter') {
      openFirst(selected.value)
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="flex min-h-0 flex-1 overflow-auto">
    <div class="m-auto w-full max-w-[68rem] px-6 py-10">
      <h1 class="mb-10 text-xl font-medium">{{ copy.library }}</h1>
      <p v-if="shows.length === 0" class="text-mute">{{ copy.emptyLibrary }}</p>
      <div
        v-else
        class="grid items-start gap-10 lg:grid-cols-[minmax(12rem,16rem)_20rem_minmax(0,1fr)] lg:gap-12"
      >
        <ul
          class="flex flex-col"
          role="listbox"
          :aria-label="copy.libraryShows"
          :aria-activedescendant="selected ? `library-show-${selected.slug}` : undefined"
        >
          <li v-for="show in shows" :key="show.id" role="none">
            <button
              :id="`library-show-${show.slug}`"
              type="button"
              role="option"
              class="flex w-full cursor-pointer items-center gap-2 py-1.5 text-left"
              :class="show.id === selected?.id ? 'text-ink' : 'text-mute hover:text-ink'"
              :aria-selected="show.id === selected?.id"
              @mouseenter="selectShow(show.id)"
              @focus="selectShow(show.id)"
              @click="selectShow(show.id)"
            >
              <span class="flex w-4 shrink-0 justify-center text-ink">
                <ChevronRight
                  v-if="show.id === selected?.id"
                  :size="14"
                  :stroke-width="1.75"
                />
              </span>
              <span class="min-w-0 truncate">{{ show.title }}</span>
            </button>
          </li>
        </ul>
        <template v-if="selected">
          <RouterLink
            v-if="firstEpisode"
            :to="{
              name: 'read',
              params: { showSlug: selected.slug, episodeSlug: firstEpisode.slug },
            }"
            class="block h-[22.5rem] w-80 shrink-0 cursor-pointer overflow-hidden rounded-md bg-well"
          >
            <figure class="size-full">
              <img
                v-if="coverSrc"
                :key="selected.id"
                :src="coverSrc"
                :alt="selected.title"
                class="scene-fade size-full object-cover"
              />
            </figure>
          </RouterLink>
          <figure
            v-else
            class="h-[22.5rem] w-80 shrink-0 overflow-hidden rounded-md bg-well"
          >
            <img
              v-if="coverSrc"
              :key="selected.id"
              :src="coverSrc"
              :alt="selected.title"
              class="scene-fade size-full object-cover"
            />
          </figure>
          <div class="flex min-h-[22.5rem] min-w-0 flex-col lg:h-[22.5rem]">
            <h2 class="font-literata text-3xl font-medium leading-tight tracking-tight text-ink">
              <span class="block truncate">{{ selected.title }}</span>
              <span v-if="selected.synthetic" class="mt-1 block font-sans text-sm font-normal text-mute">
                {{ copy.synthetic }}
              </span>
            </h2>
            <p class="mt-3 min-h-16 text-sm leading-snug text-mute">
              <span v-if="summary" class="line-clamp-3">{{ summary }}</span>
            </p>
            <ul class="mt-4 min-h-0 flex-1 overflow-auto">
              <li v-for="episode in selected.episodes" :key="episode.id">
                <RouterLink
                  :to="{
                    name: 'read',
                    params: { showSlug: selected.slug, episodeSlug: episode.slug },
                  }"
                  class="block cursor-pointer py-1.5 text-base text-ink hover:text-mute"
                >
                  {{ episode.title }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
