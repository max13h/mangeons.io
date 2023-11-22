<template>
  <div>
    <h1 class="text-3xl mb-3">
      Connexion
    </h1>

    <form action="#" method="get" class="flex flex-col" @submit.prevent="onSubmit">
      <FormInput
        name="email"
        type="email"
        label="email"
        :disable-tab="false"
      >
      </FormInput>

      <FormInput
        name="password"
        type="password"
        label="mot de passe"
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
        value="Se connecter"
        class="bg-primary text-light py-1 rounded-lg on-click cursor-pointer"
      >
    </form>
    <NuxtLink to="/register" class="text-primary p-3 flex justify-center">
      Créer un compte
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth"
})

const authStore = useAuthStore()
if (authStore.isError === true) {
  authStore.resetAuthStore()
}

const { handleSubmit } = useForm({
  validationSchema: authStore.loginSchema
})

const onSubmit = handleSubmit(async (values) => {
  authStore.resetAuthStore()
  await useLogIn(values.email, values.password)
})
</script>

<style scoped>

</style>
