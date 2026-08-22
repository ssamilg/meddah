<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { plateReady, prefetchPlate } from '@/lib/plates'

const props = defineProps<{
  src: string
  alt: string
  imgClass: string
}>()

const imgEl = ref<HTMLImageElement | null>(null)
const loaded = ref(false)

function readComplete(): boolean {
  const el = imgEl.value
  const ready = Boolean(el && el.complete && el.naturalWidth > 0) || plateReady(props.src)
  return ready
}

function syncLoaded(): void {
  loaded.value = readComplete()
}

watch(
  () => props.src,
  (src) => {
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
  <span class="relative block size-full">
    <span v-show="!loaded" class="plate-wait absolute inset-0" aria-hidden="true" />
    <img
      ref="imgEl"
      :src="src"
      :alt="alt"
      :class="[imgClass, loaded ? 'opacity-100 scene-fade' : 'opacity-0']"
      fetchpriority="high"
      @load="loaded = true"
    />
  </span>
</template>
