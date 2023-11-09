<template>
  <div>
    <FormInput
      name="name"
      type="text"
      placeholder="Tarte à la fraise"
      :disable-tab="false"
      label="Nom de votre recette 🍽️"
      label-class="text-xl mb-4"
      :value="props.name"
    >
    </FormInput>
    <FormTextArea
      name="description"
      label="Description de votre recette 😋"
      label-class="text-xl mb-4"
      :placeholder="placeholder"
      :disable-tab="false"
      class="min-h-[300px]"
      :value="props.description"
    >
    </FormTextArea>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name?: string;
  description?: string
}>()

const placeholder = "Tarte aux pommes classique : une croûte dorée, garnie de pommes sucrées, cannelle et une touche de caramel, une délicieuse tradition gourmande"
</script>

<style scoped>
</style>
