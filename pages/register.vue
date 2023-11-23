<template>
  <div>
    <h1 class="text-3xl font-semibold mb-8 underline-primary">
      Rejoignez la communauté
    </h1>

    <form class="flex flex-col" @submit.prevent="onSubmit">
      <FormInput
        name="email"
        type="email"
        label="email"
        :disable-tab="false"
      />

      <FormInput
        name="password"
        type="password"
        label="mot de passe"
        :disable-tab="false"
      />

      <FormInput
        name="confirmPassword"
        type="password"
        label="confirmer le mot de passer"
        :disable-tab="false"
      />

      <p
        v-if="authStore.statusMsg"
        class="mb-4"
        :class="{'text-red-500':authStore.isError, 'text-green-500': !authStore.isError}"
      >
        {{ authStore.statusMsg }}
      </p>
      <button type="submit" class="btn-primary">
        S'inscrire
      </button>
    </form>
    <NuxtLink to="/login" class="btn-ghost-primary w-full mt-1" tabindex="0">
      Se connecter
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth"
})

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
</script>
