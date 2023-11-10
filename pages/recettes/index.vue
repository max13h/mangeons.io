<template>
  <div class="container">
    <NuxtLink to="/recipes/">Mes recettes</NuxtLink>
    <div v-if="recipes && recipes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Pas de recette disponible</p>
      <NuxtLink to="/recipes/new" class="btn-secondary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
    <div v-else class="flex flex-col items-center">
      <div v-for="recipe in recipes" :key="recipe.id" class="w-full mb-4">
        <CardRecipe :recipe="recipe"></CardRecipe>
      </div>
      <NuxtLink to="/recipes/new" class="btn-secondary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: recipes, error } = await useFetch("/api/recipes/publicRecipes")

if (error.value) {
  throw new Error(JSON.stringify(error.value))
}

definePageMeta({
  layout: "mobile-full"
})
useSetPageHeading("Recettes")

</script>
