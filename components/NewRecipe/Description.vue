<template>
  <div>
    <h2 class="text-xl mb-8">
      Apportez une brève description de votre recette 😋
    </h2>
    <FormInputTextArea :placeholder="placeholder" :model="description" :error="errors.description" size="lg"></FormInputTextArea>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["schema"])

const { defineInputBinds, errors } = useForm({
  validationSchema: props.schema
})

const description = defineInputBinds("description")

const placeholder = "Tarte aux pommes classique : une croûte dorée, garnie de pommes sucrées, cannelle et une touche de caramel, une délicieuse tradition gourmande"
</script>

<style scoped>
</style>
