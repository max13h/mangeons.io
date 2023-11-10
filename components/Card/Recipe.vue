<template>
  <NuxtLink :to="`/recettes/${recipe.id}`" class="bg-light rounded-xl shadow w-full h-full flex">
    <NuxtImg src="/default/recipe.png" alt="default recipe image" width="100px" class="rounded-l-xl" />
    <div class="p-4 flex-grow overflow-hidden">
      <p class="text-lg truncate w-full">
        {{ props.recipe.name }}
      </p>
      <p class="text-sm line-clamp-2">
        {{ props.recipe.description }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps(["recipe"])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
}
</style>
