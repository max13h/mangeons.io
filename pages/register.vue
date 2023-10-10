<template>
  <div>
    <h1 class="text-3xl mb-3">
      Inscription
    </h1>
    <form action="" method="get" class="flex flex-col" @submit.prevent="onSubmit">
      <FormInputText label="email" :model="email" type="email" :error="errors.email"></FormInputText>

      <FormInputText label="mot de passe" :model="password" type="password" :error="errors.password"></FormInputText>

      <FormInputText label="confirmez le mot de passe" :model="confirmPassword" type="password" :error="errors.confirmPassword"></FormInputText>
      <p
        v-if="authStore.statusMsg"
        class="pb-2"
        :class="{'text-red-500':authStore.isError, 'text-green-500': !authStore.isError}"
      >
        {{ authStore.statusMsg }}
      </p>
      <input
        type="submit"
        value="S'inscrire"
        class="bg-secondary text-light py-1 rounded-lg"
      >
    </form>
    <NuxtLink to="/login" class="text-secondary p-3 flex justify-center">
      Se connecter
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { fr } from "yup-locales"
import { useForm } from "vee-validate"
import { object, string, setLocale, ref } from "yup"
import { useAuthStore } from "../stores/authStore"

setLocale(fr)

const authStore = useAuthStore()
authStore.resetAuthStore()

const schema = object({
  email: string().email().required(),
  password: string().min(6).required(),
  confirmPassword: string().oneOf([ref("password")], "Les mots de passe doivent être identiques")
})

const { defineInputBinds, errors } = useForm({
  validationSchema: schema
})

const email = defineInputBinds("email")
const password = defineInputBinds("password")
const confirmPassword = defineInputBinds("confirmPassword")

const onSubmit = async () => {
  authStore.resetAuthStore()
  if (useArePasswordsNotSimilar(password.value.value, confirmPassword.value.value)) { return }

  await useSignIn(email.value.value, password.value.value)
}

definePageMeta({
  layout: "auth"
})
</script>
