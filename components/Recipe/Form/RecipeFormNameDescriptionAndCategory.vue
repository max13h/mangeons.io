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
    />
    <FormTextArea
      name="description"
      label="Description de votre recette 😋"
      label-class="text-xl mb-4"
      :placeholder="placeholder"
      :disable-tab="false"
      class="min-h-[300px]"
      :value="props.description"
    />
    <FormSelect
      name="category"
      label="Catégorie de votre recette 📂"
      label-class="text-xl mb-4"
      :disable-tab="false"
      :value="props.category"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name?: string;
  description?: string;
  category?: string;
}>()

const placeholder = "Tarte aux pommes classique : une croûte dorée, garnie de pommes sucrées, cannelle et une touche de caramel, une délicieuse tradition gourmande"

const { data, error } = await useFetch("/api/meal_category")

if (error.value) {
  throw new Error("Error on fetch")
}
const options = data.value.data.map(item => [item.id, item.name_fr])
</script>

<style scoped>
</style>
