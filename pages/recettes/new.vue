<template>
  <div class="container mx-auto">
    <h2 class="text-2xl">
      Postez votre recette
    </h2>

    <input v-bind="email" class="input-text">
    <div>{{ errors.email }}</div>

    <input v-bind="password" class="input-text">
    <div>
      {{ errors.password }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/yup"
import { object, string } from "yup"

const { errors, defineInputBinds } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email().required(),
      password: string().min(6).required()
    })
  )
})

const email = defineInputBinds("email")
const password = defineInputBinds("password")

definePageMeta({
  layout: "focus"
})

</script>

<style scoped>

</style>
