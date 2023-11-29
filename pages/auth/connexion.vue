<template>
  <div>
    <h1 class="text-3xl font-semibold mb-8 underline-primary">
      Heureux de vous revoir !
    </h1>

    <form class="flex flex-col" @submit.prevent="onSubmit">
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

      <button type="submit" class="btn-primary mt-2">
        Se connecter
      </button>
    </form>
    <NuxtLink to="/auth/inscription" class="btn-ghost-primary w-full mt-1" tabindex="0">
      Créer un compte
    </NuxtLink>
    <NuxtLink to="/auth/mot-de-passe-oublie" class="text-sm text-primary inline-block mt-4">
      Mot de passe oublié
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "auth"
})

const authStore = useAuthStore()

const { handleSubmit } = useForm({
  validationSchema: authStore.loginSchema
})

const onSubmit = handleSubmit(async (values) => {
  await useLogIn(values.email, values.password)
})
</script>

<style scoped>

</style>
