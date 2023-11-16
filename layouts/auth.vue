<template>
  <div class="h-dynamic-screen bg-green-200 flex justify-center items-center ">
    <NuxtLink to="/" class="absolute top-8 left-1/2 -translate-x-1/2 w-[200px]">
      <NuxtImg src="/logos/LONG_GREEN_LOGO.svg" alt="mangeons.io logo" />
    </NuxtLink>
    <div class="border-2 border-dark w-full mx-2 md:w-[600px] bg-light p-3 rounded-lg">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
