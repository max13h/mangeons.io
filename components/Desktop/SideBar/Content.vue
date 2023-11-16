<template>
  <div class="h-full flex flex-col">
    <div class="grow flex flex-col px-2">
      <NuxtLink to="/menus" exact-active-class="none">
        <p class="text-2xl py-3 underline-link">
          Mes menus
        </p>
      </NuxtLink>
      <NuxtLink to="/listes-de-course" exact-active-class="none">
        <p class="text-2xl py-3 underline-link">
          Mes listes de courses
        </p>
      </NuxtLink>
      <NuxtLink to="/recettes" exact-active-class="none">
        <p class="text-2xl py-3 underline-link">
          Recettes
        </p>
      </NuxtLink>
    </div>
    <NuxtImg src="/logos/LONG_LIGHT_LOGO.svg" width="200px" class="self-center m-8" />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
