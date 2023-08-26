<template>
    <div class="m-5 bg-red-300 flex flex-col">
        <img src="../../../assets/logos/LONG LIGHT LOGO.svg" class="mb-16"/>
        <ul>
            <li class="ml-2">
                <NuxtLink to="/liste-de-course" class="flex align-middle" exact-active-class="disable">
                    <i class="ri-todo-line"></i>
                    <p>Mes listes de courses</p>
                </NuxtLink>
            </li>
            <li class="ml-2">
                <NuxtLink to="/menus" class="flex align-middle" exact-active-class="disable">
                    <i class="ri-todo-line"></i>
                    <p>Mes menus</p>
                </NuxtLink>
            </li>
        </ul>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>