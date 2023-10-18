<template>
  <div class="p-4 bg-light rounded-xl shadow w-full">
    <p>{{ props.recette.name }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["recette"])
</script>

<style scoped>

</style>
