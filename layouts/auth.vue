<template>
  <div class="min-h-dynamic-screen bg-green-200 flex flex-col justify-center items-center relative p-4 overflow-hidden">
    <NuxtLink to="/" class="my-4">
      <NuxtImg src="/logos/LONG_GREEN_LOGO.svg" alt="mangeons.io logo" width="200px" />
    </NuxtLink>
    <div class="grow flex justify-center items-center">
      <div class="card md:w-[600px] bg-light p-8">
        <slot />
      </div>
    </div>
    <NoticeContainer />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
