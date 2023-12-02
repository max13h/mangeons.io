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
const user = useSupabaseUser()
const authStore = useAuthStore()

const { handleSubmit } = useForm({
  validationSchema: authStore.changePasswordSchema
})

const onSubmit = handleSubmit(async (values) => {
  if (user.value) {
    const supabase = useSupabaseClient()

    const { error } = await supabase.auth.updateUser({
      password: values.newPassword
    })

    useHandleSupabaseReturnError(error)

    if (!error) {
      useNotice("Votre mot de passe à été changé avec succes", "success")
      return navigateTo("/app/profil")
    } else {
      useNotice("Une erreur s'est produit, veuillez réessayer", "error")
      return navigateTo("/auth/mot-de-passe-oublie")
    }
  } else {
    useNotice("Pour effectuez cette action, veuillez faire une demande de récupération de mot de passe", "error")
    return navigateTo("/auth/mot-de-passe-oublie")
  }
})
</script>

<style scoped>

</style>
