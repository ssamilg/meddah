<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { plateReady, prefetchPlate } from '@/lib/plates'

const props = defineProps<{
  src: string
  alt: string
  imgClass: string
  failedLabel: string
}>()

const imgEl = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const failed = ref(false)

function readComplete(): boolean {
  const el = imgEl.value
  const ready = Boolean(el && el.complete && el.naturalWidth > 0) || plateReady(props.src)
  return ready
}

function syncLoaded(): void {
  loaded.value = failed.value ? false : readComplete()
}

function onLoad(): void {
  failed.value = false
  loaded.value = true
}

function onError(): void {
  failed.value = true
  loaded.value = false
}

watch(
  () => props.src,
  (src) => {
    failed.value = false
    prefetchPlate(src)
    loaded.value = plateReady(src)
  },
  { immediate: true },
)

onMounted(() => {
  syncLoaded()
})
</script>

<template>
  <span class="relative flex size-full items-center justify-center overflow-hidden">
    <span v-show="!loaded && !failed" class="plate-wait absolute inset-0" aria-hidden="true" />
    <span
      v-if="failed"
      class="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-mute"
    >
      {{ failedLabel }}
    </span>
    <img
      v-show="!failed"
      ref="imgEl"
      :src="src"
      :alt="alt"
      :class="[imgClass, loaded ? 'opacity-100 scene-fade' : 'opacity-0']"
      fetchpriority="high"
      @load="onLoad"
      @error="onError"
    />
  </span>
</template>
