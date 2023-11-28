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

      <p
        v-if="authStore.statusMsg"
        class="mb-4"
        :class="{'text-red-500':authStore.isError, 'text-green-500': !authStore.isError}"
      >
        {{ authStore.statusMsg }}
      </p>
      <button type="submit" class="btn-primary mt-2">
        Se connecter
      </button>
    </form>
    <NuxtLink to="/auth/register" class="btn-ghost-primary w-full mt-1" tabindex="0">
      Créer un compte
    </NuxtLink>
    <NuxtLink to="/auth/password-forgotten" class="text-sm text-primary inline-block mt-4">
      Mot de passe oublié
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth"
})

redirectIfAuthenticated()

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
