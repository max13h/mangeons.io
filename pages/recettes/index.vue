<template>
  <div class="container h-full">
    <div v-if="recentRecipes && recentRecipes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Pas de recette disponible</p>
      <NuxtLink to="/recettes/new" class="btn-secondary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
    <div v-else class="h-full w-full flex flex-col items-center">
      <div v-for="recipe in recentRecipes" :key="recipe.id" class="w-full mb-4">
        <NuxtLink :to="`/recettes/${recipe.id}`" class="bg-red-400">
          <CardRecipe :recette="recipe"></CardRecipe>
        </NuxtLink>
      </div>
      <NuxtLink to="/recettes/new" class="btn-secondary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: { value: { data: recentRecipes } } } = await useFetch("/api/getRecentRecipes")

definePageMeta({
  layout: "mobile-full"
})
useSetPageHeading("Recettes")

</script>
