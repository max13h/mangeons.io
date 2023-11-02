<template>
  <div>
    <FormInput
      label="Nom de votre recette 🍽️"
      label-class="text-xl mb-4"
      :model="props.name"
      type="text"
      name="name"
      :error="props.errors.name"
      placeholder="Tarte à la fraise"
      :disable-tab="true"
      :value="props.name.value"
    >
    </FormInput>
    <FormTextArea
      label="Description de votre recette 😋"
      label-class="text-xl mb-4"
      :model="props.description"
      name="description"
      :error="props.errors.description"
      :placeholder="placeholder"
      :disable-tab="true"
      class="min-h-[300px] mb-8"
      :value="props.description.value"
    >
    </FormTextArea>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  name: any
  description: any
  errors: any
}>()

const placeholder = "Tarte aux pommes classique : une croûte dorée, garnie de pommes sucrées, cannelle et une touche de caramel, une délicieuse tradition gourmande"

</script>

<style scoped>
</style>
