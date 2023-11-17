<template>
  <header class="sticky top-0 bg-light shadow-sm border-b-2 flex justify-between items-center border-dark w-full select-none">
    <NuxtImg src="/logos/LITTLE_LIGHT_LOGO.svg" width="48px" alt="mangeons.io logo" class="w-12 m-1" />
    <NuxtLink
      to="/notifications"
      class="
        ri-notification-3-line
        text-2xl
        w-8
        h-8
        flex
        justify-center
        items-center
        on-click
        m-1
      "
      exact-active-class="none"
    >
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
</script>
