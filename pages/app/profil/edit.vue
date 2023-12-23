<template>
  <div class="p-4 flex flex-col h-full">
    <Teleport v-if="useIsModalOpen('recipeFormInvalid')" to="#modal">
      <p class="mb-4 text-lg">
        Oups, des problèmes ont été repérés 🚨
      </p>
      <ol>
        <li v-for="(error, index) in arrayOfErrors" :key="index" class="mb-2">
          {{ index + 1 }}. <span class="italic">{{ error }}</span>
        </li>
      </ol>
    </Teleport>
    <div class="grow">
      <FormInput
        name="first_name"
        type="text"
        :disable-tab="false"
        label="Prénom"
        label-class="text-xl mb-4"
        :value="publicUser.first_name"
        :convert-undefined-to-null="true"
      />
      <FormInput
        name="last_name"
        type="text"
        :disable-tab="false"
        label="Nom de famille"
        label-class="text-xl mb-4"
        :value="publicUser.last_name"
        :convert-undefined-to-null="true"
      />
      <FormInput
        name="age"
        type="number"
        :disable-tab="false"
        label="Age"
        label-class="text-xl mb-4"
        :value="publicUser.age"
        :convert-undefined-to-null="true"
      />
    </div>

    <button type="button" class="btn-primary border-none flex justify-center items-center" @click="onSubmit">
      Enregistrer
      <i class="ri-save-3-line inline-block text-2xl w-8" />
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app-deep-focus"
})

const publicUser = await usePublicUser()
const formSchemaStore = useFormSchemaStore()

const { handleSubmit } = useForm({
  validationSchema: formSchemaStore.schemaProfile
})

const onSuccess = async (values: any) => {
  values.id = publicUser.value.id

  const { error, status } = await useFetch("/api/user/user", {
    method: "patch",
    body: { userData: values }
  })

  if (status.value === "success") {
    return navigateTo({
      path: "/app/profil"
    })
  } else {
    throw new Error(`Error on useFetch => ${JSON.stringify(error)}`)
  }
}

const arrayOfErrors: globalThis.Ref<string[]> = ref([])

const onInvalidSubmit = ({ errors }: { errors: any }) => {
  arrayOfErrors.value = Object.values(errors)
  useOpenModal("recipeFormInvalid")
}
const onSubmit = handleSubmit(onSuccess, onInvalidSubmit)
</script>
