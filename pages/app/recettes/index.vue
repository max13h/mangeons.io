<template>
  <div class="container">
    <NuxtLink to="/app/recettes/moi" class="btn-outline-primary inline-block text-center  w-full mb-4">
      Mes recettes
    </NuxtLink>
    <div v-if="recipes && recipes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Pas de recette disponible</p>
      <NuxtLink to="/app/recettes/new" class="btn-primary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
    <div v-else class="flex flex-col items-center">
      <div v-for="recipe in recipes" :key="recipe.id" class="w-full mb-4">
        <RecipeCard :recipe="recipe" :show-is-public="false" />
      </div>
      <NuxtLink to="/app/recettes/new" class="btn-primary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app"
})
const supabase = useSupabaseClient()

const { data: recipes, error } = await useAsyncData("publicRecipes", async () => {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, name, cooking_time, description, image_url, meal_category_id (id, name_fr)")
    .eq("is_public", true)

  useHandleSupabaseReturnError(error)
  return data
})

useHandleFetchError(error)

</script>
