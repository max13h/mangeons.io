<template>
  <header class="flex justify-between items-center w-full select-none sticky top-0 bg-light shadow border-b border-dark px-2 py-1">
    <NuxtImg src="/logos/LONG_LIGHT_LOGO.svg" width="150px" alt="mangeons.io logo" />
    <NuxtLink
      to="/app/notifications"
      exact-active-class="none"
    >
      <Icon name="fluent:alert-16-regular" size="2rem" />
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
</script>
