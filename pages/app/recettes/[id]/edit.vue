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
    <div class="flex flex-col items-center h-full w-full overflow-x-hidden flex-grow pt-4 pl-4 pr-4">
      <div class="w-full overflow-x-hidden flex-grow ">
        <swiper
          v-if="recipe && recipe.name"
          class="h-full"
          :allow-touch-move="false"
          :space-between="30"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          :pagination="{
            el: '.swiper-pagination-el',
            type: 'bullets',
            bulletActiveClass: 'swiper-pagination-active-bullet'
          }"
          @reach-end="reachEnd = true"
        >
          <swiper-slide>
            <RecipeFormNameDescriptionAndCategory :name="recipe.name" :description="recipe.description" :category="recipe.meal_category_id" />
          </swiper-slide>
          <swiper-slide>
            <RecipeFormCookingTimeAndKitchenEquipments :cooking-time="recipe.cooking_time" />
          </swiper-slide>
          <swiper-slide>
            <RecipeFormAlimentaryProducts />
          </swiper-slide>
          <swiper-slide>
            <RecipeFormContent :content="recipe.content"></RecipeFormContent>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="flex flex-col items-center w-full">
      <span class="swiper-pagination-el w-full flex justify-center my-1" />
      <div class="flex justify-between w-full px-4 pb-4 pt-2 relative">
        <button type="button" class="swiper-button-prev page-btn btn-outline-primary">
          <Icon name="fluent:chevron-double-left-16-filled" size="1.8rem" />
        </button>
        <button v-if="reachEnd" type="button" class="flex items-center btn-primary shadow-md" @click="onSubmit">
          <span class="hidden-under-320 me-2">Enregistrer</span>
          <Icon name="fluent:save-16-filled" size="1.5rem" />
        </button>
        <button type="button" class="swiper-button-next page-btn btn-outline-primary">
          <Icon name="fluent:chevron-double-right-16-filled" size="1.8rem" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { register } from "swiper/element/bundle"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"

definePageMeta({
  layout: "app-deep-focus"
})
const recipeStore = useRecipeStore()
const route = useRoute()

register()
const reachEnd = ref(false)

const arrayOfErrors: globalThis.Ref<string[]> = ref([])

const recipe: globalThis.Ref<any> = ref(null)

onMounted(async () => {
  const { data, error } = await useAsyncData("getRecipe", async () => {
    const supabase = useSupabaseClient()

    const { data, error } = await supabase.rpc("get_all_data_of_recipe", { recipe_id: route.params.id })

    useHandleSupabaseIssue(data, error)
    return data[0]
  })

  useHandleFetchError(error)

  recipe.value = data.value
  recipeStore.selectedAlimentaryProducts = data.value.alimentary_products
  recipeStore.selectedKitchenEquipments = data.value.kitchen_equipments
})

const { handleSubmit } = useForm({
  validationSchema: recipeStore.schemaNewRecipe
})

const onSuccess = async (values: any) => {
  values.id = route.params.id

  const { error, status } = await useFetch("/api/recipe/recipe", {
    method: "put",
    body: { recipe_data: values }
  })

  if (status.value === "success") {
    return navigateTo({
      path: `/app/recettes/${route.params.id}`,
      query: {
        backPageURL: "/app/recettes"
      }
    })
  } else {
    throw new Error(`Error on useFetch => ${JSON.stringify(error)}`)
  }
}
const onInvalidSubmit = ({ errors }: { errors: any }) => {
  arrayOfErrors.value = Object.values(errors)
  useOpenModal("recipeFormInvalid")
}
const onSubmit = handleSubmit(onSuccess, onInvalidSubmit)
</script>

<style scoped>
.page-btn {
  @apply w-fit px-4 shadow-md
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

@media (max-width: 320px) {
  .hidden-under-320 {
    @apply hidden
  }
}
</style>
