<template>
  <div class="h-full p-5 flex flex-col">
    <div class="btn-close-container">
      <button
        type="button"
        class="ri-close-line"
        @click="useToggleSideBar"
      />
    </div>
    <NuxtImg src="/logos/LONG_LIGHT_LOGO.svg" class="mt-8 mb-16" />
    <ul class="grow">
      <li class="ml-2">
        <NuxtLink to="/menus" class="flex items-center on-click" exact-active-class="none">
          <i class="ri-restaurant-line mr-1" />
          <p>Mes menus</p>
        </NuxtLink>
      </li>
      <li class="ml-2">
        <NuxtLink to="/shopping-list" class="flex items-center on-click" exact-active-class="none">
          <i class="ri-todo-line mr-1" />
          <p>Mes listes de courses</p>
        </NuxtLink>
      </li>
      <li class="ml-2">
        <NuxtLink to="/recipes" class="flex items-center on-click" exact-active-class="none">
          <i class="ri-restaurant-2-line mr-1" />
          <p>Recettes</p>
        </NuxtLink>
      </li>
    </ul>
    <div class="bottom-0 left-0 w-full flex justify-end">
      <NuxtLink to="/profil" class="ri-user-line text-2xl w-8 h-8 border-2 border-black rounded-full flex justify-center items-center on-click" exact-active-class="none">
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
