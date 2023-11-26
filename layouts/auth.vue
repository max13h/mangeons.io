<template>
  <div class="h-dynamic-screen bg-green-200 flex justify-center items-center relative">
    <NuxtLink to="/" class="absolute top-8 left-1/2 -translate-x-1/2 w-[200px]">
      <NuxtImg src="/logos/LONG_GREEN_LOGO.svg" alt="mangeons.io logo" />
    </NuxtLink>
    <div class="card md:w-[600px] bg-light p-8 mx-4">
      <slot />
    </div>
    <NoticeContainer />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
