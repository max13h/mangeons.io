<template>
    <div class="h-full p-5 flex flex-col">
        <i class="ri-close-line text-xl absolute top-2 right-2 w-7 h-7 flex justify-center items-center rounded-full" @click="useToggleSideBar"></i>
        <img src="../../../assets/logos/LONG LIGHT LOGO.svg" class="mt-8 mb-16"/>
        <ul class=" grow">
            <li class="ml-2">
                <NuxtLink to="/menus" class="flex items-center on-click" exact-active-class="disable">
                    <i class="ri-restaurant-line mr-1"></i>
                    <p>Mes menus</p>
                </NuxtLink>
            </li>
            <li class="ml-2">
                <NuxtLink to="/liste-de-course" class="flex items-center on-click" exact-active-class="disable">
                    <i class="ri-todo-line mr-1"></i>
                    <p>Mes listes de courses</p>
                </NuxtLink>
            </li>
        </ul>
        <div class=" bottom-0 left-0 w-full flex justify-end">
            <i class="ri-user-line text-2xl w-8 h-8 border-2 border-black rounded-full flex justify-center items-center"></i>
        </div>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>