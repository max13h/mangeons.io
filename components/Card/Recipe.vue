<template>
  <NuxtLink :to="`/recipes/${recipe.id}`" class="bg-light rounded-xl shadow w-full h-full flex">
    <NuxtImg src="/default/recipe.png" alt="default recipe image" width="100px" class="rounded-l-xl object-cover" />
    <div class="p-4 flex-grow overflow-hidden">
      <p class="text-lg truncate w-full">
        {{ props.recipe.name }}
      </p>
      <p class="text-sm truncate italic">
        {{ props.recipe.description }}
      </p>
      <p class="w-full text-end text-xs mt-2">
        <i class="ri-time-line" />
        {{ props.recipe.cooking_time }} min
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps(["recipe"])
</script>

<style scoped>
</style>
