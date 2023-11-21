<template>
  <div>
    <p>Membres:</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: {
    creator: string;
    id: string;
    is_open: boolean;
    join_code: string | null;
    members: {
        id: string;
        username: string;
        username_in_household: string;
      }[];
    name: string;
  }
}>()
</script>

<style scoped>

</style>
