<script setup lang="ts">
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'

withDefaults(
  defineProps<{
    tone?: 'success' | 'error' | 'warning' | 'info' | 'ghost'
    icon?: Component
    label?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    iconOnly?: boolean
    to?: string
  }>(),
  { tone: 'ghost', type: 'button', disabled: false, iconOnly: false },
)

const toneClass = {
  success: 'btn-outline btn-success',
  error: 'btn-outline btn-error',
  warning: 'btn-outline btn-warning',
  info: 'btn-outline btn-info',
  ghost: 'btn-ghost',
} as const
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    :to="to"
    :type="to ? undefined : type"
    class="btn btn-sm gap-1.5"
    :class="toneClass[tone ?? 'ghost']"
    :disabled="disabled"
    :aria-label="label"
  >
    <component :is="icon" v-if="icon" class="size-4" />
    <span v-if="label && !iconOnly">{{ label }}</span>
    <slot />
  </component>
</template>
