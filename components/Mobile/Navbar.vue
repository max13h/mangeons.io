<template>
    <nav class="flex justify-around bg-secondary w-full rounded-md rounded-tl-tr drop-shadow-[0px_0px_3px_rgba(0,0,0,0.25)]">
        <NuxtLink to="/liste-de-course" class="ri-todo-line text-light text-4xl py-2 on-click">
        </NuxtLink>
        <NuxtLink to="/menus" class="ri-restaurant-fill text-light text-4xl py-2 on-click">
        </NuxtLink>
        <i class="ri-menu-line text-light text-4xl py-2 on-click" @click="useToggleSideBar">
        </i>
    </nav>
</template>

<script setup lang="ts">
</script>