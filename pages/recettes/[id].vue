<template>
  <div>
    <p>hellooo</p>
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

</script>

<style scoped>

</style>
