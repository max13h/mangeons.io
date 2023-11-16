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
    <div class="flex flex-col items-center h-full w-full overflow-x-hidden flex-grow py-4">
      <p class="mb-4 text-center rounded-md bg-primary-100 p-2">
        Renseignez les infomations concernant votre nouvelle recette !
      </p>

      <div class="w-full overflow-x-hidden flex-grow ">
        <swiper
          v-if="recipe"
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
    <div class="flex justify-between w-full min-w-[100px] border border-slate-100 shadow-xl z-20 p-4 relative bg-light rounded-3xl ">
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
  layout: "app-deep-focus"
})
const recipeStore = useRecipeStore()
const modalStore = useModalStore()
const route = useRoute()

register()
const reachEnd = ref(false)
const pageNb = ref(1)

const arrayOfErrors: globalThis.Ref<string[]> = ref([])

const recipe: globalThis.Ref<any> = ref(null)

onMounted(async () => {
  const { data, error } = await useFetch("/api/recipe/recipe", {
    query: { id: route.params.id }
  })

  if (error.value) {
    throw new Error("Error on fetch")
  }

  recipe.value = data.value
  recipeStore.selectedAlimentaryProducts = data.value.alimentary_products
  recipeStore.selectedKitchenEquipments = data.value.kitchen_equipments

  console.log();
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
      path: `/recettes/${route.params.id}`,
      query: {
        backPageURL: "/recettes"
      }
    })
  } else {
    throw new Error(`Error on useFetch => ${JSON.stringify(error)}`)
  }
}
const onInvalidSubmit = ({ values, errors }: {errors: any}) => {
  arrayOfErrors.value = Object.values(errors)
  useOpenModal("recipeFormInvalid")
  console.log(values);
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
