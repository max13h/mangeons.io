<template>
  <div>
    <h1 class="text-3xl mb-3">
      Inscription
    </h1>
    <form action="" method="get" class="flex flex-col" @submit.prevent="onSubmit">
      <FormInput
        name="email"
        type="email"
        label="email"
        :disable-tab="false"
      >
      </FormInput>

      <FormInput
        name="password"
        type="email"
        label="mot de passe"
        :disable-tab="false"
      >
      </FormInput>

      <FormInput
        name="confirmPassword"
        type="password"
        label="confirmer le mot de passer"
        :disable-tab="false"
      >
      </FormInput>
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
import { useForm } from "vee-validate"

const authStore = useAuthStore()
authStore.resetAuthStore()

const { handleSubmit } = useForm({
  validationSchema: authStore.registerSchema
})

const onSubmit = handleSubmit(async (values) => {
  authStore.resetAuthStore()
  if (useArePasswordsNotSimilar(values.password, values.confirmPassword)) { return }
  await useSignIn(values.email, values.password)
})

definePageMeta({
  layout: "auth"
})
</script>
