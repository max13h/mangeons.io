<template>
  <div>
    <div v-if="recipe.author.id === publicUser.id">
      <NuxtLink :to="`/recettes/${route.params.id}/edit`" type="button" class="btn-outline-secondary">
        Edit
      </NuxtLink>
    </div>
    <h2 class="text-2xl">
      {{ useCapitalize(recipe.name) }}
    </h2>
    <p>by {{ recipe.author.username || "undefined" }}</p>
    <p class="w-full text-center">
      Temps de préparation: {{ recipe.cooking_time }} minutes
    </p>
    <div class="bg-slate-200 rounded-xl p-4 mt-8">
      <p class="whitespace-pre">
        {{ recipe.description }}
      </p>
    </div>
    <div class="p-4">
      <p class="whitespace-pre">
        {{ recipe.content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()

const { data: recipeData, error: recipeError } = await useFetch("/api/getRecipeById", {
  query: { id: route.params.id }
})

if (recipeError.value || recipeData.value.error || recipeData.value.data.length === 0) {
  throw new Error("No such recipe")
}

const { data: publicUserData, error: publicUserError } = await useFetch("/api/getPublicUser")

const recipe = recipeData.value.data[0]
const publicUser = publicUserData.value.data[0]

definePageMeta({
  layout: "mobile-focus"
})

console.log(route.params.id);

</script>

<style scoped>

</style>
