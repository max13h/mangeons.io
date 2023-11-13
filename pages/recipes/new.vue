<template>
  <div class="flex flex-col items-center h-full">
    <Teleport v-if="modalStore.whatIsOpen === 'recipeFormInvalid'" to="#modal">
      <p class="mb-4 text-lg">
        Oups, des problèmes ont été repérés 🚨
      </p>
      <ol>
        <li v-for="(error, index) in arrayOfErrors" :key="index" class="mb-2">
          {{ index + 1 }}. <span class="italic">{{ error }}</span>
        </li>
      </ol>
    </Teleport>
    <div class="flex flex-col items-center h-full w-full overflow-x-hidden flex-grow pt-4 pl-4 pr-4">
      <p class="mb-4 text-center rounded-md bg-primary-100 p-2">
        Renseignez les infomations concernant votre nouvelle recette !
      </p>

      <div class="w-full overflow-x-hidden flex-grow ">
        <swiper
          class="h-full"
          :allow-touch-move="false"
          :space-between="30"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          @navigation-next="pageNb++"
          @navigation-prev="pageNb--"
          @reach-end="reachEnd = true"
        >
          <swiper-slide>
            <RecipeFormNameDescriptionAndCategory />
          </swiper-slide>
          <swiper-slide>
            <RecipeFormCookingTimeAndKitchenEquipments></RecipeFormCookingTimeAndKitchenEquipments>
          </swiper-slide>
          <swiper-slide>
            <RecipeFormAlimentaryProducts></RecipeFormAlimentaryProducts>
          </swiper-slide>
          <swiper-slide>
            <RecipeFormContent></RecipeFormContent>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="flex justify-between w-full min-w-[100px] my-shadow z-20 p-4 relative bg-light">
      <button type="button" class="swiper-button-prev page-btn">
        <i class="ri-arrow-left-double-line" />
      </button>
      <button v-if="reachEnd" type="button" class="btn-secondary border-none flex items-center" @click="onSubmit">
        Enregistrer
        <i class="ri-save-3-line inline-block text-2xl w-8" />
      </button>
      <button type="button" class="swiper-button-next page-btn">
        <i class="ri-arrow-right-double-line" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { register } from "swiper/element/bundle"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"

definePageMeta({
  layout: "mobile-deep-focus"
})
const recipeStore = useRecipeStore()
const modalStore = useModalStore()

register()
const reachEnd = ref(false)
const pageNb = ref(1)

const { handleSubmit } = useForm({
  validationSchema: recipeStore.schemaNewRecipe
})

const arrayOfErrors: globalThis.Ref<string[]> = ref([])

const onSuccess = async (values: any) => {
  const publicUser = await useGetPublicUser()
  values.author = publicUser.value.id

  const { data, error, status } = await useFetch("/api/recipe/recipe", {
    method: "post",
    body: { recipe_data: values }
  })

  if (status.value === "success") {
    return navigateTo({
      path: `/recipes/${data.value}`,
      query: {
        backPageURL: "/recipes"
      }
    })
  } else {
    throw new Error(`Error on useFetch => ${JSON.stringify(error)}`)
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
  @apply p-2 bg-primary-100 rounded-lg w-16 text-2xl
}

.swiper-button-disabled{
    @apply opacity-0
}

.swiper-slide {
  overflow-y: scroll;
}

.my-shadow {
  box-shadow: 0px 1px 24px 0px rgba(0,0,0,0.45);
}
</style>
