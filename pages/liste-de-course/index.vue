<template>
  <div>
    <button type="button" ></button>
    <NuxtLink to="/liste-de-course/new" class=" inline-block p-5 bg-primary rounded-3xl on-click">Créer une Liste</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "mobile-full"
})
useSetPageHeading("Listes")

const supabase = useSupabaseClient

</script>
