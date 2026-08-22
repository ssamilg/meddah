<script setup lang="ts">
import { computed } from 'vue'
import { uiCopy } from '@/i18n'
import { useLocale } from '@/composables/useLocale'
import { showCoverSrcs } from '@/lib/library'
import { prefetchPlates } from '@/lib/plates'

const { locale, toggleLocale } = useLocale()
const copy = computed(() => uiCopy(locale.value))
prefetchPlates(showCoverSrcs())
</script>

<template>
  <div class="relative flex min-h-0 flex-1 overflow-auto">
    <button
      type="button"
      class="absolute top-0 right-0 z-10 flex h-14 cursor-pointer items-center px-6 text-sm text-ink hover:text-mute"
      @click="toggleLocale"
    >
      {{ copy.language }}
    </button>
    <div class="scene-fade m-auto w-full max-w-[68rem] px-6 py-16">
      <div class="grid gap-8 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-8">
        <h1
          class="font-literata text-6xl font-medium tracking-tight text-ink md:text-7xl lg:text-8xl"
        >
          Meddah
        </h1>
        <p
          class="max-w-sm font-literata text-xl italic leading-snug text-mute md:text-2xl"
        >
          {{ copy.landingQuote }}
        </p>
        <p
          class="font-literata text-lg leading-[1.85] text-ink lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:self-end md:text-xl"
        >
          <span v-for="line in copy.landingAspects" :key="line" class="block">
            {{ line }}
          </span>
        </p>
        <RouterLink
          to="/"
          class="w-fit text-base text-ink underline decoration-1 underline-offset-4 hover:text-mute focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:mt-12"
        >
          {{ copy.landingEnter }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
