<template>
  <div class="container">
    <NuxtLink to="/recettes/moi" class="btn-outline-primary inline-block text-center  w-full mb-4">
      Mes recettes
    </NuxtLink>
    <div v-if="recipes && recipes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Pas de recette disponible</p>
      <NuxtLink to="/recettes/new" class="btn-primary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
    <div v-else class="flex flex-col items-center">
      <div v-for="recipe in recipes" :key="recipe.id" class="w-full mb-4">
        <RecipeCard :recipe="recipe" :show-is-public="false" />
      </div>
      <NuxtLink to="/recettes/new" class="btn-primary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app"
})

const { data: recipes, error } = await useFetch("/api/recipes/publicRecipes")

if (error.value) {
  throw new Error(JSON.stringify(error.value))
}

useSetPageHeading("Recettes")
</script>
