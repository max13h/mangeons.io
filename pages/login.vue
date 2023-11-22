<template>
  <div>
    <h1 class="">
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
      <button type="submit" class="btn-primary">
        Se connecter
      </button>
    </form>
    <NuxtLink to="/register" class="btn-ghost-primary w-full mt-1">
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
