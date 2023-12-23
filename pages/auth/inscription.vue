<template>
  <div>
    <h1 class="text-3xl font-semibold mb-8 underline-primary">
      Rejoignez la communauté
    </h1>

    <form class="flex flex-col" @submit.prevent="onSubmit">
      <div>
        <label
          for="username"
          class="ms-2 flex items-center"
        >
          {{ capitalize("Nom d'utilisateur") }}
          <AuthRegisterUsernameTooltip />
        </label>
        <div class="relative">
          <input
            id="username"
            v-model="usernameValue"
            name="username"
            type="text"
            autofocus
            autocomplete="off"
            :class="hasFetchForUsername ? (isUsernameUnique ? 'username-valide' : 'username-invalide') : ''"
          >
          <AuthRegisterUsernameTooltipAvailability :has-fetch-for-username="hasFetchForUsername" :is-username-unique="isUsernameUnique" :is-fetching-for-username="isFetchingForUsername" />
        </div>
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
      <button type="submit" class="btn-primary mt-2">
        S'inscrire
      </button>
    </form>
    <NuxtLink to="/auth/connexion" class="btn-ghost-primary w-full mt-1" tabindex="0">
      Se connecter
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

const formSchemaStore = useFormSchemaStore()

const { handleSubmit } = useForm({
  validationSchema: formSchemaStore.registerSchema
})

const { value: usernameValue, errorMessage: usernameErrorMessage, errors: usernameErrors, setErrors: usernameSetErrors } = useField(() => "username")

const isFetchingForUsername: globalThis.Ref<boolean> = ref(false)
const hasFetchForUsername: globalThis.Ref<boolean> = ref(false)
const isUsernameUnique: globalThis.Ref<boolean | null> = ref(null)
let isUsernameUniqueTimeoutId: any = null

const fetchUsernameUniqueness = async () => {
  if (usernameErrors.value.length === 0) {
    isFetchingForUsername.value = true

    isUsernameUnique.value = await useIsUsernameUnique(usernameValue.value as string)
    hasFetchForUsername.value = true

    if (!isUsernameUnique.value) {
      usernameSetErrors("Le nom d'utilisateur est déjà utilisé")
    }
  }
}

watch(usernameValue, () => {
  clearTimeout(isUsernameUniqueTimeoutId)
  isFetchingForUsername.value = false
  hasFetchForUsername.value = false
  isUsernameUnique.value = false

  isUsernameUniqueTimeoutId = setTimeout(fetchUsernameUniqueness, 1000)
})

const onSubmit = handleSubmit(async (values) => {
  if (isUsernameUnique.value) {
    await useSignUp(values.username, values.email, values.password)
  } else {
    usernameSetErrors("Le nom d'utilisateur est déjà utilisé")
  }
})
</script>

<style scoped>
.username-valide {
  @apply border-green-500 border-solid
}
.username-valide:focus {
  @apply border-green-500 border-solid
}

.username-invalide {
  @apply border-red-500 border-solid
}
.username-invalide:focus {
  @apply border-red-500 border-solid
}

</style>
