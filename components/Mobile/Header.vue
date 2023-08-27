<template>
  <header class="sticky top-0 bg-light flex border-b-2 border-dark w-full">
    <img src="../../assets/logos/LITTLE LIGHT LOGO.svg" alt="mangeons.io logo" class="absolute top-1/2 -translate-y-1/2 left-1  w-12">
    <h1 class="text-3xl w-full text-center my-2">
      {{ pageStore.heading }}
    </h1>
  </header>
</template>

<script setup lang="ts">
import { usePageStore } from "../../stores/pageStore"
const pageStore = usePageStore()
</script>
