<template>
  <div>
    <h1 class="text-3xl font-semibold mb-8 underline-primary">
      Pas de problème !
    </h1>
    <CardInfo class="mb-4" label="Instructions">
      <ul class="list-decimal ms-4 text-sm">
        <li>
          Entrer votre email d'inscription
        </li>
        <li>Cliquer sur "Récuperer"</li>
        <li>
          Cliquer sur le lien reçu par email pour changer votre mot de passe
        </li>
      </ul>
    </CardInfo>
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <FormInput
        name="email"
        type="email"
        label="email"
        :disable-tab="false"
      >
      </FormInput>

      <button type="submit" class="btn-primary mt-2">
        Récuperer
      </button>
    </form>
    <NuxtLink to="/auth/connexion" class="btn-ghost-primary w-full mt-1" tabindex="0">
      Annuler
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "auth"
})

const formSchemaStore = useFormSchemaStore()

const { handleSubmit } = useForm({
  validationSchema: formSchemaStore.forgottenPasswordSchema
})

const onSubmit = handleSubmit(async (values) => {
  const supabase = useSupabaseClient()

  const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    redirectTo: "http://localhost:3000/auth/changer-de-mot-de-passe"
  })

  useHandleSupabaseReturnError(error)

  useNotice("Cliquez sur le lien reçu par email pour récuperer votre compte", "success")
  return navigateTo("/auth/connexion")
})

</script>

<style scoped>

</style>
