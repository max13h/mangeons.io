<template>
  <nav class="flex justify-around items-center bg-primary w-full rounded-tl-md rounded-tr-md p-2 drop-shadow-[0px_0px_3px_rgba(0,0,0,0.25)] select-none">
    <NuxtLink to="/listes-de-course" exact-active-class="active-link">
      <Icon name="fluent:receipt-16-filled" size="2.5rem" class="text-light" />
    </NuxtLink>
    <NuxtLink to="/menus" exact-active-class="active-link">
      <Icon name="fluent:food-16-filled" size="2.5rem" class="text-light" />
    </NuxtLink>
    <Icon name="fluent:text-align-justify-20-filled" size="2.5rem" class="text-light" @click="useToggleSideBar" />
  </nav>
</template>

<script setup lang="ts">
</script>
