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
      <div class="flex justify-between">
        <p v-if="props.showIsPublic" class="w-full text-xs mt-2">
          <i
            class=""
            :class="[
              props.recipe.is_public ? 'text-green-500' : 'text-black',
              props.recipe.is_public ? 'ri-checkbox-circle-line' : 'ri-lock-line'
            ]"
          />
          {{ props.recipe.is_public ? "Publié" : "Privé" }}
        </p>
        <p class="w-full text-end text-xs mt-2">
          <i class="ri-time-line" />
          {{ props.recipe.cooking_time }} min
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps(["recipe", "showIsPublic"])
</script>

<style scoped>
</style>
