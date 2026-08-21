<script setup lang="ts">
import { X } from '@lucide/vue'
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  closeLabel: string
}>()

const open = defineModel<boolean>({ default: false })

function close(): void {
  open.value = false
}

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close()
  }
}

watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#05070c]/88 p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="alt"
      @click="close"
    >
      <button
        type="button"
        class="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center text-ink hover:text-mute"
        :aria-label="closeLabel"
        @click="close"
      >
        <X :size="22" :stroke-width="1.7" />
      </button>
      <img
        :src="props.src"
        :alt="alt"
        class="max-h-[92vh] max-w-[96vw] object-contain"
        @click.stop
      />
    </div>
  </Teleport>
</template>
