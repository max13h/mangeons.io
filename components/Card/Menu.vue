<template>
  <div>
    <p>{{ props.menu.created_at }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["menu"])
</script>

<style scoped>
</style>
