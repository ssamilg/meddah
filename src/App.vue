<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import { useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'
import { themeLabel, uiCopy } from '@/i18n'
import { loadReaderShow, readerPreview } from '@/lib/library'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const DESK_ORIGIN = 'http://localhost:5174'

const route = useRoute()
const { locale, toggleLocale } = useLocale()
const { theme, toggleTheme } = useTheme()
const copy = computed(() => uiCopy(locale.value))
const themeButtonLabel = computed(() => themeLabel(locale.value, theme.value))

const editHref = computed(() => {
  const showSlug = String(route.params.showSlug ?? '')
  const episodeSlug = String(route.params.episodeSlug ?? '')
  const sceneId = route.hash.replace(/^#/, '')
  let href: string | undefined
  if (import.meta.env.DEV && route.name === 'read' && showSlug && episodeSlug) {
    const path = `${DESK_ORIGIN}/shows/${showSlug}/episodes/${episodeSlug}`
    href = sceneId ? `${path}?scene=${encodeURIComponent(sceneId)}` : path
  }
  return href
})

const showTitle = computed(() => {
  const showSlug = String(route.params.showSlug ?? '')
  const preview = readerPreview(route.query)
  const show = route.name === 'read' && showSlug ? loadReaderShow(showSlug, preview) : null
  return show?.title ?? ''
})
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-page text-ink">
    <AppNav
      v-if="route.name !== 'landing'"
      class="shrink-0"
      :language="copy.language"
      :theme-label="themeButtonLabel"
      :theme="theme"
      :edit-label="copy.edit"
      :edit-href="editHref"
      :show-title="showTitle"
      @locale="toggleLocale"
      @theme="toggleTheme"
    />
    <RouterView v-slot="{ Component }">
      <component :is="Component" class="flex min-h-0 flex-1 flex-col" />
    </RouterView>
  </div>
</template>
