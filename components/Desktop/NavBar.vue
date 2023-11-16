<template>
  <nav
    class="
      flex
      flex-col
      items-center
      bg-secondary
      w-16
      select-none
      z-50
    "
  >
    <div class="flex flex-col items-center flex-grow">
      <NuxtLink to="/listes-de-course" class="ri-todo-line text-light text-4xl py-2 on-click" />
      <NuxtLink to="/menus" class="ri-restaurant-line text-light text-4xl py-2 on-click" />
      <NuxtLink to="/recettes" class="ri-book-2-line text-light text-4xl py-2 on-click" />
    </div>
    <i
      class="text-light text-4xl py-2 on-click"
      :class="pageStore.isSideBarOpen ? 'ri-expand-left-line' : 'ri-expand-right-line'"
      @click="useToggleSideBar"
    />
    <NuxtLink to="/profil" class="ri-user-line text-light text-4xl py-2 on-click" />
  </nav>
</template>

<script setup lang="ts">
const pageStore = usePageStore()
</script>
