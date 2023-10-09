<template>
  <div class="container h-full">
    <div v-if="recettes && recettes.length === 0" class="flex flex-col h-full justify-center items-center">
      <p>Pas de recette disponible</p>
      <NuxtLink to="/recettes/new" class="btn-primary mt-16">
        Poster une recette
      </NuxtLink>
    </div>
    <div v-else class="">
      <div v-for="recette in recettes" :key="recette.id">
        {{ recette }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "main-mobile-app"
})
await useSetPageHeading("Recettes")

const supabase = useSupabaseClient()

const { data: recettes } = await supabase
  .from("recipes")
  .select("id,name,cooking_time, description")
</script>
