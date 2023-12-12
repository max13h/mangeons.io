<template>
  <div class="overflow-y-scroll">
    <RecipeImage :image-url="recipeData.image_url" :name="recipeData.name" />
    <h2 class="text-2xl">
      {{ capitalize(recipeData.name) }}
    </h2>
    <p>by {{ recipeData.author.username || "undefined" }}</p>
    <p class="w-full text-center">
      Temps de préparation: {{ recipeData.cooking_time }} minutes
    </p>
    <div class="bg-slate-200 rounded-xl p-4 mt-8">
      <p class="whitespace-normal">
        {{ recipeData.description }}
      </p>
    </div>
    <div class="w-full">
      <p class="whitespace-pre-wrap">
        {{ recipeData.content }}
      </p>
    </div>
    <div v-if="publicUser?.id == recipeData.author.id">
      <NuxtLink :to="`/app/recettes/${route.params.id}/edit`" type="button" class="btn-outline-primary">
        Edit
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app-focus"
})
const route = useRoute()
const publicUser = await useGetPublicUser()

const { data: recipeData, error } = await useAsyncData("getRecipe", async () => {
  const supabase = useSupabaseClient()

  const { data, error } = await supabase.rpc("get_all_data_of_recipe", { recipe_id: route.params.id })

  useHandleSupabaseIssue(data, error)

  return data[0]
})

useHandleFetchError(error)

const contentObject = useParseStringToStepListObject(recipeData.value.content)
</script>

<style scoped>

</style>
