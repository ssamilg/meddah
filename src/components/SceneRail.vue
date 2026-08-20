<script setup lang="ts">
import type { Scene } from '@/types/piece'

defineProps<{
  scenes: Scene[]
  index: number
  sceneLabel: string
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="flex justify-center overflow-x-auto py-1" role="list">
    <div class="flex gap-1.5">
      <button
        v-for="(item, i) in scenes"
        :key="item.id"
        type="button"
        role="listitem"
        class="size-10 shrink-0 overflow-hidden rounded-sm p-0 opacity-35 transition-opacity hover:opacity-70"
        :class="i === index ? 'opacity-100 outline outline-1 outline-offset-1 outline-line' : ''"
        :aria-current="i === index ? 'true' : undefined"
        :aria-label="`${sceneLabel} ${i + 1}: ${item.title}`"
        @click="emit('select', i)"
      >
        <img :src="item.image" :alt="item.title" class="size-full object-cover" />
      </button>
    </div>
  </div>
</template>
