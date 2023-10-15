<template>
  <div>
    <h2 class="text-xl mb-8">
      Donnez un nom à votre recette 🍽️
    </h2>
    <FormInputText label="" placeholder="Tarte à la fraise" name="name" :model="name" type="text" :error="errors.name"></FormInputText>
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()
const props = defineProps(["schema"])

const { defineInputBinds, errors } = useForm({
  validationSchema: props.schema
})

const name = defineInputBinds("name")

watchEffect(() => {
  newRecipeStore.name = name.value
})
</script>

<style scoped>
</style>
