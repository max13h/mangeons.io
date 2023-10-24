<template>
  <div>
    <h2 class="text-2xl">{{ useCapitalize(recipe.name) }}</h2>
    <p>by {{ recipe.author || "undefined" }}</p>
    <p class="w-full text-center">
      Temps de préparation: {{ recipe.cooking_time }} minutes
    </p>
    <div class="bg-slate-200 rounded-xl p-4 mt-8">
      <p>{{ recipe.description }}</p>
    </div>
    <div class="p-4">
      {{ recipe.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data, error } = await useFetch("/api/getRecipeById", {
  query: { id: route.params.id }
})

if (error.value || data.value.error || data.value.data.length === 0) {
  throw new Error("No such recipe")
}

const recipe = data.value.data[0]

definePageMeta({
  layout: "mobile-focus"
})

</script>

<style scoped>

</style>
