<template>
  <div class="container h-full">
    <div v-if="recettes && recettes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Pas de recette disponible</p>
      <NuxtLink to="/recettes/new" class="btn-secondary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
    <div v-else class="h-full w-full flex flex-col items-center">
      <div v-for="recette in recettes" :key="recette.id" class="w-full mb-4">
        <NuxtLink :to="`/recettes/${recette.id}`" class="bg-red-400">
          <CardRecipe :recette="recette"></CardRecipe>
        </NuxtLink>
      </div>
      <NuxtLink to="/recettes/new" class="btn-secondary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "mobile-full"
})
await useSetPageHeading("Recettes")

const supabase = useSupabaseClient()

const { data: recettes } = await supabase
  .from("recipes")
  .select("id,name,cooking_time, description")
</script>
