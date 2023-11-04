<template>
  <div>
    <FormInput
      name="name"
      type="text"
      placeholder="Tarte à la fraise"
      :disable-tab="true"
      label="Nom de votre recette 🍽️"
      label-class="text-xl mb-4"
    >
    </FormInput>
    <FormTextArea
      name="description"
      label="Description de votre recette 😋"
      label-class="text-xl mb-4"
      :placeholder="placeholder"
      :disable-tab="true"
      class="min-h-[300px] mb-8"
    >
    </FormTextArea>
  </div>
</template>

<script setup lang="ts">
const placeholder = "Tarte aux pommes classique : une croûte dorée, garnie de pommes sucrées, cannelle et une touche de caramel, une délicieuse tradition gourmande"
</script>

<style scoped>
</style>
