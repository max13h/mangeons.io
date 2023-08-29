<template>
  <div>
    <h1 class="text-3xl mb-3">
      Connexion
    </h1>
    <form action="#" method="get" class="flex flex-col" @submit.prevent="onSubmit">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        name="email"
        class="mb-2 p-1 rounded-lg border-2 input-text"
        autofocus
      >
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        name="password"
        class="mb-4 p-1 rounded-lg input-text"
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
import { useAuthStore } from "../stores/authStore"

const authStore = useAuthStore()

const email = ref("")
const password = ref("")

const onSubmit = async () => {
  authStore.resetAuthStore()

  await useLogIn(email.value, password.value)
}

definePageMeta({
  layout: "auth"
})
</script>

<style scoped>

</style>
