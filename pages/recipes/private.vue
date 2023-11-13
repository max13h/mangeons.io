<template>
  <div class="container">
    <div v-if="recipes && recipes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Vous n'avez pas encore créé de recettes</p>
    </div>
    <div v-else class="flex flex-col w-full">
      <div v-for="publicRecipe in publicRecipes" :key="publicRecipe.id" class="w-full mb-4">
        <RecipeCard :recipe="publicRecipe" :show-is-public="true" />
      </div>
      <div v-for="privateRecipe in privateRecipes" :key="privateRecipe.id" class="w-full mb-4">
        <RecipeCard :recipe="privateRecipe" :show-is-public="true" />
      </div>
    </div>
    <NuxtLink to="/recipes/new" class="btn-secondary mt-16">
      Poster une recette
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "mobile-focus"
})
useSetPageHeading("Mes recettes")

const publicUser = await useGetPublicUser()

const { data: recipes, error } = await useFetch("/api/recipes/userRecipes", {
  method: "get",
  query: { id: publicUser.value.id }
})

if (error.value) {
  throw new Error(JSON.stringify(error.value))
}

const publicRecipes = recipes.value.filter((recipe) => recipe.is_public === true)
const privateRecipes = recipes.value.filter((recipe) => recipe.is_public === false)
</script>

<style scoped>

</style>
