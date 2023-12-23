<template>
  <div class="overflow-y-scroll">
    <RecipeImage :recipe-data="recipeData" />
    <h1 class="mb-4">
      {{ capitalize(recipeData.name) }}
    </h1>
    <div class=" mb-4">
      <div class="flex items-center justify-between mb-4">
        <p class="w-full">
          Par {{ recipeData.author.username || "quelqu'un 🤷" }}
        </p>
        <p class="w-full text-end flex items-center justify-end">
          {{ recipeData.cooking_time }} {{ recipeData.cooking_time === 1 ? "minute" : "minutes" }} en cuisine
          <Icon name="fluent:clock-16-regular" class="ms-1" />
        </p>
      </div>
      <p class="whitespace-normal">
        {{ recipeData.description }}
      </p>
      <div v-if="publicUser?.id == recipeData.author.id" class="w-full text-end">
        <NuxtLink :to="`/app/recettes/${route.params.id}/edit`" type="button" class="btn-outline-primary mt-4">
          Edit
        </NuxtLink>
      </div>
    </div>
    <div class="w-full">
      <h2 class="text-xl mb-4">
        Suivez les instructions pour préparer la recette:
      </h2>
      <RecipeContent :content="recipeData.content" />
      <!-- <p class="whitespace-pre-wrap">
        {{ recipeData.content }}
      </p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app-focus"
})
const route = useRoute()
const publicUser = await usePublicUser()

const { data: recipeData, error } = await useAsyncData("getRecipe", async () => {
  const supabase = useSupabaseClient()

  const { data, error } = await supabase.rpc("get_all_data_of_recipe", { recipe_id: route.params.id })

  useHandleSupabaseIssue(data, error)

  return data[0]
})

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Cette recette n'existe pas",
    fatal: true
  })
}

</script>

<style scoped>

</style>
