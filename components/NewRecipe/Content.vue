<template>
  <div>
    <h2 class="text-xl mb-4 min-h-[56px]">
      Décrivrez <span class="underline">étape</span> par <span class="underline">étape</span> comment réussir votre recette 🔪
    </h2>
    <FormInputTextArea
      label=""
      :placeholder="placeholder"
      name="content"
      :model="content"
      :error="errors.content"
      size="lg"
    >
    </FormInputTextArea>
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()
const props = defineProps(["schema"])

const { defineInputBinds, errors } = useForm({
  validationSchema: props.schema
})

const content = defineInputBinds("content")
const placeholder = "1. Préchauffer le four à 180°C \n2. .."

onMounted(() => {
  watchEffect(() => {
    newRecipeStore.content = content.value.value
  })
})
</script>

<style scoped>
</style>
