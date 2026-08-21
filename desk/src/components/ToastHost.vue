<script setup lang="ts">
import { Check, CircleAlert, Info, TriangleAlert, X } from '@lucide/vue'
import { computed } from 'vue'
import { dismissToast, toasts, type Tone } from '@desk/feedback'

const icons: Record<Tone, typeof Check> = {
  success: Check,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
}

const alertClass: Record<Tone, string> = {
  success: 'alert-outline alert-success',
  error: 'alert-outline alert-error',
  warning: 'alert-outline alert-warning',
  info: 'alert-outline alert-info',
}

const visible = computed(() => toasts.value)
</script>

<template>
  <div class="toast toast-end toast-bottom z-50">
    <div
      v-for="item in visible"
      :key="item.id"
      class="alert"
      :class="alertClass[item.tone]"
    >
      <component :is="icons[item.tone]" class="size-4 shrink-0" />
      <span>{{ item.message }}</span>
      <button type="button" class="btn btn-ghost btn-xs" @click="dismissToast(item.id)">
        <X class="size-3.5" />
      </button>
    </div>
  </div>
</template>
