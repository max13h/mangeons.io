<template>
  <nav class="flex justify-around bg-secondary w-full rounded-md rounded-tl-tr drop-shadow-[0px_0px_3px_rgba(0,0,0,0.25)] select-none">
    <NuxtLink to="/shopping-list" class="ri-todo-line text-light text-4xl py-2 on-click" />
    <NuxtLink to="/menus" class="ri-restaurant-fill text-light text-4xl py-2 on-click" />
    <i class="ri-menu-line text-light text-4xl py-2 on-click" @click="useToggleSideBar" />
  </nav>
</template>

<script setup lang="ts">
</script>
