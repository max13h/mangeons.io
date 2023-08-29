<template>
  <div>
    <h1 class="text-3xl mb-3">
      Inscription
    </h1>
    <form action="" method="get" class="flex flex-col" @submit.prevent="onSubmit">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        name="email"
        class="mb-2 p-1 border-2 border-secondary rounded-lg input-text"
        autofocus
        required
      >
      <label for="password">Mot de passe</label>
      <input
        id="password"
        v-model="password"
        type="password"
        name="password"
        class="mb-4 p-1 border-2 border-secondary rounded-lg input-text"
        required
      >
      <label for="confirm-password">Confirmer le mot de passe</label>
      <input
        id="confirm-password"
        v-model="confirmPassword"
        type="password"
        name="confirm-password"
        class="mb-4 p-1 border-2 border-secondary rounded-lg input-text"
        required
      >
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
import { useAuthStore } from "../stores/authStore"

const authStore = useAuthStore()

const email = ref("")
const password = ref("")
const confirmPassword = ref("")

const onSubmit = async () => {
  authStore.resetAuthStore()
  if (useArePasswordsNotSimilar(password.value, confirmPassword.value)) { return }

  await useSignIn(email.value, password.value)
}

definePageMeta({
  layout: "auth"
})
</script>
