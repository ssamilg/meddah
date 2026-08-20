<script setup lang="ts">
import type { Scene } from '@/types/library'

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
    <div class="flex items-center" role="list">
      <button
        v-for="(item, i) in scenes"
        :key="item.id"
        type="button"
        role="listitem"
        class="flex h-8 w-4 cursor-pointer items-center justify-center"
        :aria-current="i === index ? 'true' : undefined"
        :aria-label="`${sceneLabel} ${i + 1}: ${item.title}`"
        @click="emit('select', i)"
      >
        <span
          class="block rounded-full bg-ink"
          :class="i === index ? 'size-2.5 opacity-100' : 'size-2 opacity-40 hover:opacity-75'"
        />
      </button>
    </div>
  </nav>
</template>
