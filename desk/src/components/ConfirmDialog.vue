<script setup lang="ts">
import { TriangleAlert, X } from '@lucide/vue'
import { nextTick, ref, watch } from 'vue'
import DeskButton from '@desk/components/DeskButton.vue'
import { confirmOpen, resolveConfirm } from '@desk/feedback'

const el = ref<HTMLDialogElement | null>(null)
const dialog = confirmOpen

watch(dialog, async (value) => {
  await nextTick()
  if (el.value && value) {
    el.value.showModal()
  } else if (el.value?.open) {
    el.value.close()
  }
})

function onClose(): void {
  if (confirmOpen.value) {
    resolveConfirm(false)
  }
}

function cancel(): void {
  resolveConfirm(false)
}

function ok(): void {
  resolveConfirm(true)
}
</script>

<template>
  <dialog ref="el" class="modal" @close="onClose">
    <div v-if="dialog" class="modal-box">
      <div class="mb-3 flex items-center gap-2">
        <TriangleAlert
          class="size-5"
          :class="dialog.tone === 'error' ? 'text-error' : 'text-warning'"
        />
        <h3 class="text-lg font-medium">{{ dialog.title }}</h3>
      </div>
      <p class="text-sm text-mute">{{ dialog.body }}</p>
      <div class="modal-action">
        <DeskButton :icon="X" label="Cancel" @click="cancel" />
        <DeskButton :tone="dialog.tone" :label="dialog.confirmLabel" @click="ok" />
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button type="submit">close</button>
    </form>
  </dialog>
</template>
