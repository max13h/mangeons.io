<template>
  <div>
    <h1 class="text-3xl font-semibold mb-8 underline-primary">
      Rejoignez la communauté
    </h1>

    <form class="flex flex-col" @submit.prevent="onSubmit">
      <div>
        <label
          for="username"
          class="inline-block ms-2"
        >
          {{ capitalize("Nom d'utilisateur") }}
        </label>
        <input
          v-model="usernameValue"
          name="username"
          type="text"
          autofocus
        >
        <div class="mb-4">
          <span
            v-if="usernameErrorMessage"
            class="text-red-500 text-sm"
          >
            {{ capitalize(usernameErrorMessage) }}
          </span>
        </div>
      </div>

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

const { handleSubmit } = useForm({
  validationSchema: authStore.registerSchema
})

const { value: usernameValue, errorMessage: usernameErrorMessage, setErrors: usernameSetErrors } = useField(() => "username")

const onSubmit = handleSubmit(async (values) => {
  await useSignIn(values.email, values.password, values.username)
})
</script>
