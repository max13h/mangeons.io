<template>
  <div>
    <h1 class="text-3xl mb-3">
      Connexion
    </h1>

    <form action="#" method="get" class="flex flex-col" @submit.prevent="onSubmit">
      <FormInputText
        label="email"
        :model="email"
        type="email"
        name="email"
        :error="errors.email"
        placeholder=""
      >
      </FormInputText>

      <FormInputText
        label="mot de passe"
        :model="password"
        type="password"
        name="password"
        :error="errors.password"
        placeholder=""
      >
      </FormInputText>

      <p
        v-if="authStore.statusMsg"
        class="pb-2"
        :class="{'text-red-500':authStore.isError, 'text-green-500': !authStore.isError}"
      >
        {{ authStore.statusMsg }}
      </p>
      <input
        type="submit"
        value="Se connecter"
        class="bg-secondary text-light py-1 rounded-lg on-click cursor-pointer"
      >
    </form>
    <NuxtLink to="/register" class="text-secondary p-3 flex justify-center">
      Créer un compte
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { fr } from "yup-locales"
import { useForm } from "vee-validate"
import { object, string, setLocale } from "yup"
import { useAuthStore } from "../stores/authStore"

setLocale(fr)
const authStore = useAuthStore()
if (authStore.isError === true) {
  authStore.resetAuthStore()
}

const schema = object({
  email: string().email().required(),
  password: string().min(6).required()
})

const { defineInputBinds, errors } = useForm({
  validationSchema: schema
})

const email = defineInputBinds("email")
const password = defineInputBinds("password")

const onSubmit = async () => {
  authStore.resetAuthStore()
  await useLogIn(email.value.value, password.value.value)
}

definePageMeta({
  layout: "auth"
})
</script>

<style scoped>

</style>
