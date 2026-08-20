<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import rawPiece from '../content/piece.json'
import AppNav from '@/components/AppNav.vue'
import BookBar from '@/components/BookBar.vue'
import SceneRail from '@/components/SceneRail.vue'
import SceneStage from '@/components/SceneStage.vue'
import { useReader } from '@/composables/useReader'
import { useTheme } from '@/composables/useTheme'
import { themeLabel, uiCopy } from '@/i18n'
import { computed } from 'vue'

const { piece, scenes, index, locale, imagesOn, scene, go, goTo, toggleLocale, toggleImages } =
  useReader(rawPiece)
const { theme, toggleTheme } = useTheme()

const copy = computed(() => uiCopy(locale.value))
const themeButtonLabel = computed(() => themeLabel(locale.value, theme.value))
const imagesLabel = computed(() => (imagesOn.value ? copy.value.imagesOn : copy.value.imagesOff))
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

    <div class="flex flex-1 flex-col justify-center px-4 py-8">
      <div class="mx-auto w-full max-w-5xl">
        <BookBar
          v-if="piece"
          :title="piece.title"
          :synthetic="piece.synthetic"
          :synthetic-label="copy.synthetic"
          :images-on="imagesOn"
          :images-label="imagesLabel"
          @images="toggleImages"
        />

        <SceneStage :scene="scene" :images-on="imagesOn" :empty="copy.empty" />

        <div class="mt-4 flex items-center justify-center gap-4 text-base">
          <button
            type="button"
            class="flex cursor-pointer items-center gap-1.5 text-ink disabled:cursor-not-allowed disabled:text-mute/50"
            :disabled="index === 0"
            @click="go(-1)"
          >
            <ChevronLeft :size="16" :stroke-width="1.75" />
            {{ copy.prev }}
          </button>
          <SceneRail
            :scenes="scenes"
            :index="index"
            :scene-label="copy.scene"
            @select="goTo"
          />
          <button
            type="button"
            class="flex cursor-pointer items-center gap-1.5 text-ink disabled:cursor-not-allowed disabled:text-mute/50"
            :disabled="index >= scenes.length - 1"
            @click="go(1)"
          >
            {{ copy.next }}
            <ChevronRight :size="16" :stroke-width="1.75" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
