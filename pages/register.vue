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
          <Tooltip class="ms-2" position="bottom" tooltip-class="min-w-[18rem]">
            <p class="mb-2">Le nom d'utilisateur doit être formaté de cette manière:</p>
            <ul class="list-disc ms-4">
              <li>Entre 3 et 18 caractères</li>
              <li>Uniquement des lettres de A à Z, des chiffres et les caracères spéciaux trait d'union (-), trais bas (_) & point (.)</li>
              <li>Au moins une lettre</li>
              <li>Ne peut pas commencer pas un caractère spécial</li>
              <li>Ne peut pas se terminer pas un point (.)</li>
              <li>Les caractères spéciaux ne peuvent pas s'enchainer</li>
            </ul>
          </Tooltip>
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
          <TooltipContainer v-if="hasFetchForUsername && !isUsernameUnique" position="left" class="absolute right-2 top-1/2 -translate-y-1/2" tooltip-class="min-w-[12rem]">
            <Icon name="fluent:dismiss-circle-16-filled" size="1.5rem" class="text-red-500 " />
            <template #tooltip>
              <p>Le nom d'utilisateur est déjà utilisé</p>
            </template>
          </TooltipContainer>
          <TooltipContainer v-else-if="hasFetchForUsername && isUsernameUnique" position="left" class="absolute right-2 top-1/2 -translate-y-1/2" tooltip-class="min-w-[12rem]">
            <Icon name="fluent:checkmark-circle-16-filled" size="1.5rem" class="text-green-500" />
            <template #tooltip>
              <p>Le nom d'utilisateur est disponible</p>
            </template>
          </TooltipContainer>
          <TooltipContainer v-else-if="isFetchingForUsername && !hasFetchForUsername" position="left" class="absolute right-2 top-1/2 -translate-y-1/2" tooltip-class="min-w-[12rem]">
            <Icon name="svg-spinners:ring-resize" size="1.2rem" class="text-primary" />
            <template #tooltip>
              <p>Nous recherchons la disponibilité du nom d'utilisateur</p>
            </template>
          </TooltipContainer>
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
redirectIfAuthenticated()

const authStore = useAuthStore()

const { handleSubmit } = useForm({
  validationSchema: authStore.registerSchema
})

const { value: usernameValue, errorMessage: usernameErrorMessage, errors: usernameErrors, setErrors: usernameSetErrors } = useField(() => "username")

const isFetchingForUsername: globalThis.Ref<boolean> = ref(false)
const hasFetchForUsername: globalThis.Ref<boolean> = ref(false)
const isUsernameUnique: globalThis.Ref<boolean | null> = ref(null)
let isUsernameUniqueTimeoutId: any = null

const fetchUsernameUniqueness = async () => {
  if (usernameErrors.value.length === 0) {
    isFetchingForUsername.value = true

    const { data, error } = await useFetch(`/api/auth/users/${usernameValue}`)

    useHandleFetchError(error)

    hasFetchForUsername.value = true
    isUsernameUnique.value = data.value

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
