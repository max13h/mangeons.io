<template>
  <header class="sticky top-0 bg-light shadow-sm border-b-2 flex border-dark w-full select-none">
    <NuxtImg src="/logos/LITTLE_LIGHT_LOGO.svg" alt="mangeons.io logo" class="absolute top-1/2 -translate-y-1/2 left-1  w-12" />
    <h1 class="w-full text-center my-2 text-xl sm:text-2xl md:text-3xl">
      {{ pageStore.heading }}
    </h1>
  </header>
</template>

<script setup lang="ts">
import { usePageStore } from "../../stores/pageStore"
const pageStore = usePageStore()
</script>
