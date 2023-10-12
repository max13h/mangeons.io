<template>
  <div class="container mx-auto">
    <h2 class="text-2xl mb-8">
      Postez votre recette
    </h2>

    <form action="#" method="post" class="flex flex-col" @submit.prevent="onSubmit">
      <FormInputText label="Nom de la recette" placeholder="Tarte à la fraise" :model="name" type="text" :error="errors.name"></FormInputText>
      <FormInputTextArea label="Brève description" placeholder="Tarte à la fraise" :model="description" :error="errors.description" size="sm"></FormInputTextArea>

      <button class="btn-primary inline w-48 self-center" @click="addIngredients()">
        Add ingredients
        <i class="ri-add-circle-line text-2xl align-middle" />
      </button>

      <Teleport v-if="modalStore.isOpen" to="#modal">
        <ModalAddIngredients></ModalAddIngredients>
      </Teleport>

      <FormInputTextArea label="Recette detaillée" placeholder="Tarte à la fraise" :model="content" :error="errors.content" size="lg"></FormInputTextArea>

      <input
        type="submit"
        value="Sauvegarder"
        class="bg-secondary text-light py-1 rounded-lg on-click cursor-pointer"
      >
    </form>
  </div>
</template>

<script setup lang="ts">
import { fr } from "yup-locales"
import { useForm } from "vee-validate"
import { object, string, setLocale } from "yup"
import { useModalStore } from "../../stores/modalStore"

setLocale(fr)

const schema = object({
  name: string().min(6).max(80).trim().required(),
  description: string().min(6).max(120).trim().required(),
  content: string().min(100).trim().required()
})

const { defineInputBinds, errors } = useForm({
  validationSchema: schema
})

const name = defineInputBinds("name")
const description = defineInputBinds("description")
const content = defineInputBinds("content")

const onSubmit = () => {

}

const modalStore = useModalStore()

const addIngredients = () => {
  modalStore.isOpen = true
}

definePageMeta({
  layout: "focus"
})

</script>

<style scoped>

</style>
