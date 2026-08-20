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
  <div class="flex min-h-dvh flex-col bg-page text-ink">
    <AppNav
      :language="copy.language"
      :theme-label="themeButtonLabel"
      :theme="theme"
      @locale="toggleLocale"
      @theme="toggleTheme"
    />
    <RouterView />
  </div>
</template>
