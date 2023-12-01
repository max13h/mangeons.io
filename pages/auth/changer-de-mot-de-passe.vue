<template>
  <div>
    <h1 class="text-3xl font-semibold mb-8 underline-primary">
      Recuperation de mot de passe
    </h1>
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <FormInput
        name="newPassword"
        type="password"
        label="nouveau mot de passe"
        :disable-tab="false"
      >
      </FormInput>

      <FormInput
        name="confirmNewPassword"
        type="password"
        label="confirmez le nouveau mot de passe"
        :disable-tab="false"
      >
      </FormInput>

      <button type="submit" class="btn-primary mt-2">
        Changer de mot de passe
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth"
})

const authStore = useAuthStore()

const { handleSubmit } = useForm({
  validationSchema: authStore.loginSchema
})

const onSubmit = handleSubmit(async (values) => {
  await useChangePassword(values.newPassword)
})
</script>

<style scoped>

</style>
