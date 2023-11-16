<template>
  <div>
    <NuxtLink to="/listes-de-course/new" class=" inline-block p-5 bg-primary rounded-3xl on-click">
      Créer une Liste
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app"
})
useSetPageHeading("Listes")

</script>
