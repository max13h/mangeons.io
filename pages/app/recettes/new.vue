<template>
  <div class="flex flex-col items-center h-full">
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
    <div class="flex-grow pt-4 pl-4 pr-4 overflow-y-scroll overflow-x-hidden">
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <RecipeFormNameDescriptionAndCategory v-if="pageNb === 1" />
      </Transition>
      <Transition
        enter-active-class="transition duration-100 ease-out"
        :enter-from-class="goToNext ? 'translate-x-full' : '-translate-x-full'"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-x-0"
        :leave-to-class="goToNext ? '-translate-x-full' : 'translate-x-full'"
      >
        <RecipeFormCookingTimeAndKitchenEquipments v-if="pageNb === 2" />
      </Transition>
      <Transition
        enter-active-class="transition duration-100 ease-out"
        :enter-from-class="goToNext ? 'translate-x-full' : '-translate-x-full'"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-x-0"
        :leave-to-class="goToNext ? '-translate-x-full' : 'translate-x-full'"
      >
        <RecipeFormAlimentaryProducts v-if="pageNb === 3" />
      </Transition>
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <RecipeFormContent v-if="pageNb === 4" />
      </Transition>
    </div>
    <div class="flex flex-col items-center w-full">
      <div class="w-full flex justify-center my-1">
        <span
          class="pagination-bullet"
          :class="{ 'pagination-bullt-active': pageNb === 1 }"
        />
        <span
          class="pagination-bullet"
          :class="{ 'pagination-bullt-active': pageNb === 2 }"
        />
        <span
          class="pagination-bullet"
          :class="{ 'pagination-bullt-active': pageNb === 3 }"
        />
        <span
          class="pagination-bullet"
          :class="{ 'pagination-bullt-active': pageNb === 4 }"
        />
      </div>
      <div class="flex justify-between w-full px-4 pb-4 pt-2 relative">
        <button
          type="button"
          class="page-btn btn-outline-primary"
          :class="{ 'invisible': pageNb === 1 }"
          @click="prevPage()"
        >
          <Icon name="fluent:chevron-double-left-16-filled" size="1.8rem" />
        </button>
        <button v-if="reachEnd" type="button" class="flex items-center btn-primary shadow-md" @click="onSubmit">
          <span class="hidden-under-320 me-2">Enregistrer</span>
          <Icon name="fluent:save-16-filled" size="1.5rem" />
        </button>
        <button
          type="button"
          class="page-btn btn-outline-primary"
          :class="{ 'invisible': pageNb === 4 }"
          @click="nextPage()"
        >
          <Icon name="fluent:chevron-double-right-16-filled" size="1.8rem" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app-deep-focus"
})
const recipeStore = useRecipeStore()

const pageNb = ref(1)
const changingPage = ref(false)
const goToNext = ref(false)
const reachEnd = ref(false)

const nextPage = () => {
  const previousPage = pageNb.value
  if (previousPage === 4 || changingPage.value) {
    return
  }

  changingPage.value = true

  goToNext.value = true
  pageNb.value = 0

  setTimeout(() => {
    pageNb.value = previousPage + 1
    changingPage.value = false

    if (pageNb.value === 4) {
      reachEnd.value = true
    }
  }, 150)
}

const prevPage = () => {
  const previousPage = pageNb.value
  if (previousPage === 1 || changingPage.value) {
    return
  }

  changingPage.value = true

  goToNext.value = false
  pageNb.value = 0

  setTimeout(() => {
    pageNb.value = previousPage - 1
    changingPage.value = false
  }, 150)
}

const { handleSubmit } = useForm({
  validationSchema: recipeStore.schemaNewRecipe
})

const arrayOfErrors: globalThis.Ref<string[]> = ref([])

const onSuccess = async (values: any) => {
  const publicUser = await useGetPublicUser()

  if (publicUser.value) {
    values.author = publicUser.value.id
  } else {
    return useErrorNotice()
  }

  const { data, error, status } = await useAsyncData("postRecipe", async () => {
    const supabase = useSupabaseClient()

    const { data, error } = await supabase.rpc("post_all_data_of_new_recipe", { recipe_data: values })

    useHandleSupabaseReturnError(error)
    return data
  })

  if (status.value === "success" && !error.value) {
    return navigateTo({
      path: `/app/recettes/${data.value}`,
      query: {
        backPageURL: "/app/recettes"
      }
    })
  } else {
    return useErrorNotice()
  }
}
const onInvalidSubmit = ({ errors }: {errors: any}) => {
  arrayOfErrors.value = Object.values(errors)
  useOpenModal("recipeFormInvalid")
}
const onSubmit = handleSubmit(onSuccess, onInvalidSubmit)
</script>

<style scoped>
.page-btn {
  @apply w-fit px-4 shadow-md
}
.my-shadow {
  box-shadow: 0px 1px 24px 0px rgba(0,0,0,0.45);
}

.pagination-bullet {
  @apply w-2 h-2 bg-slate-300 rounded-full mx-1
}

.pagination-bullt-active {
  @apply bg-primary
}

@media (max-width: 320px) {
  .hidden-under-320 {
    @apply hidden
  }
}

</style>
