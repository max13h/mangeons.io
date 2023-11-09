<template>
  <div>
    <div v-if="publicUser.id == recipeData.author.id">
      <NuxtLink :to="`/recettes/${route.params.id}/edit`" type="button" class="btn-outline-secondary">
        Edit
      </NuxtLink>
    </div>
    <h2 class="text-2xl">
      {{ useCapitalize(recipeData.name) }}
    </h2>
    <p>by {{ recipeData.author.username || "undefined" }}</p>
    <p class="w-full text-center">
      Temps de préparation: {{ recipeData.cooking_time }} minutes
    </p>
    <div class="bg-slate-200 rounded-xl p-4 mt-8">
      <p class="whitespace-pre">
        {{ recipeData.description }}
      </p>
    </div>
    <div class="p-4">
      <p class="whitespace-pre">
        {{ recipeData.content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const publicUser = await useGetPublicUser()

const { data: recipeData, error: recipeError } = await useFetch("/api/recipe", {
  method: "get",
  query: { id: route.params.id }
})

if (recipeError.value) {
  throw new Error("Error during the useFetch call")
}

definePageMeta({
  layout: "mobile-focus"
})
</script>

<style scoped>

</style>
