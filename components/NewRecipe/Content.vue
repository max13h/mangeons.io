<template>
  <div>
    <h2 class="text-xl mb-4 min-h-[56px]">
      Décrivrez <span class="underline">étape</span> par <span class="underline">étape</span> comment réussir votre recette 🔪
    </h2>
    <FormTextArea
      :model="props.content"
      type="text"
      name="content"
      :error="props.errors.content"
      :placeholder="placeholder"
      :disable-tab="true"
      class="min-h-[300px] mb-4"
    >
    </FormTextArea>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: any;
  errors: any
}>()

const placeholder = "1. Préchauffer le four à 180°C \n2. .."
</script>

<style scoped>
</style>
