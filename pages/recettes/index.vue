<template>
  <div class="container">
    <div v-if="recentRecipes && recentRecipes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Pas de recette disponible</p>
      <NuxtLink to="/recettes/new" class="btn-secondary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
    <div v-else class="flex flex-col items-center">
      <div v-for="recipe in recentRecipes" :key="recipe.id" class="w-full mb-4">
        <CardRecipe :recipe="recipe"></CardRecipe>
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
