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
    <NuxtLink to="/app/recettes/new" class="btn-primary mt-16">
      Poster une recette
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app-focus"
})
const publicUser = await usePublicUser()

const { data: recipes, error } = await useAsyncData("personalRecipes", async () => {
  const supabase = useSupabaseClient()

  if (publicUser.value) {
    const { data, error } = await supabase
      .from("recipes")
      .select("id, name, cooking_time, description, image_url, meal_category_id (id, name_fr), is_public")
      .eq("author", publicUser.value.id)

    useHandleSupabaseReturnError(error)
    return data
  } else {
    throw new Error("No public user")
  }
})

useHandleFetchError(error)

const publicRecipes = recipes.value?.filter(recipe => recipe.is_public === true)
const privateRecipes = recipes.value?.filter(recipe => recipe.is_public === false)
</script>

<style scoped>

</style>
