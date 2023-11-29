<template>
  <div class="card pt-2 shadow-none border-2 border-slate-200">
    <p class="flex items-center font-light text-sm mb-2 text-slate-400">
      <Icon name="fluent:info-16-regular" size="0.9rem" class="me-1" />
      {{ props.label || "Informations" }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string;
}>()
</script>
