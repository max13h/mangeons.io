<template>
  <div>
    <h2 class="text-xl mb-8">
      Donnez un nom à votre recette 🍽️</h2>
    <FormInputText placeholder="Tarte à la fraise" :model="name" type="text" :error="errors.name"></FormInputText>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["schema"])

const { defineInputBinds, errors } = useForm({
  validationSchema: props.schema
})

const name = defineInputBinds("name")
</script>

<style scoped>
</style>
