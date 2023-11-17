
import type { string } from 'yup';
<template>
  <div :class="props.class">
    <p class="text-sm opacity-60">
      {{ props.label }}
    </p>
    <p v-if="props.value" class="p-2 inline-block w-full bg-slate-100 rounded-xl">
      {{ props.value }}
    </p>
    <p v-else class="p-2 inline-block w-full bg-slate-100 rounded-xl opacity-60 italic">
      Non renseigné
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string | number | null;
  class?: string;
}>()
</script>

<style scoped>

</style>
