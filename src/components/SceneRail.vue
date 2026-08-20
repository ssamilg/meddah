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
  <nav class="flex items-center justify-center" :aria-label="sceneLabel">
    <div class="flex items-center gap-[5px]" role="list">
      <button
        v-for="(item, i) in scenes"
        :key="item.id"
        type="button"
        role="listitem"
        class="flex items-center justify-center px-0 py-2"
        :aria-current="i === index ? 'true' : undefined"
        :aria-label="`${sceneLabel} ${i + 1}: ${item.title}`"
        @click="emit('select', i)"
      >
        <span
          class="block size-1.5 rounded-full bg-ink"
          :class="i === index ? 'opacity-100' : 'opacity-35 hover:opacity-70'"
        />
      </button>
    </div>
  </nav>
</template>
