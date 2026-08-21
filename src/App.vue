<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import { useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'
import { themeLabel, uiCopy } from '@/i18n'
import { computed } from 'vue'

const { locale, toggleLocale } = useLocale()
const { theme, toggleTheme } = useTheme()
const copy = computed(() => uiCopy(locale.value))
const themeButtonLabel = computed(() => themeLabel(locale.value, theme.value))
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-page text-ink">
    <AppNav
      class="shrink-0"
      :language="copy.language"
      :theme-label="themeButtonLabel"
      :theme="theme"
      @locale="toggleLocale"
      @theme="toggleTheme"
    />
    <RouterView v-slot="{ Component }">
      <component :is="Component" class="flex min-h-0 flex-1 flex-col" />
    </RouterView>
  </div>
</template>
