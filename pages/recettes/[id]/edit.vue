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
          v-if="formatedRecipe"
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
            <RecipeFormNameAndDescription :name="formatedRecipe[0].name" :description="formatedRecipe[0].description" />
          </swiper-slide>
          <swiper-slide>
            <RecipeFormCookingTimeAndKitchenEquipments :cooking-time="formatedRecipe[0].cooking_time" />
          </swiper-slide>
          <swiper-slide>
            <RecipeFormAlimentaryProducts />
          </swiper-slide>
          <swiper-slide>
            <RecipeFormContent :content="formatedRecipe[0].content"></RecipeFormContent>
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
const route = useRoute()

register()
const reachEnd = ref(false)
const pageNb = ref(1)

const arrayOfErrors: globalThis.Ref<string[]> = ref([])

const formatedRecipe: globalThis.Ref<fetchRecipe[] | null> = ref(null)

onMounted(async () => {
  const {
    recipeData: { value: { data: recipe } },
    kitchenEquipmentsData: { value: { data: kitchenEquipments } },
    alimentaryProductsData: { value: { data: alimentaryProducts } }
  } = await useFetchRecipeData(route.params.id)

  const formatedAlimentaryProducts = alimentaryProducts.map((item: any) => {
    item.details = item.alimentary_product_id
    delete item.alimentary_product_id
    return item
  })
  const formatedKitchenEquipments = kitchenEquipments.map((item: any) => item.kitchen_equipment_id)

  formatedRecipe.value = recipe
  recipeStore.selectedAlimentaryProducts = formatedAlimentaryProducts
  recipeStore.selectedKitchenEquipments = formatedKitchenEquipments
})

const { handleSubmit } = useForm({
  validationSchema: recipeStore.schemaNewRecipe
})

const onSuccess = async (values: any) => {
  values.id = route.params.id
  // const saveRecipe = await useFetch("/api/recipe", {
  //   method: "put",
  //   body: values
  // })

  // if (saveRecipe.status.value === "success") {
  //   return navigateTo({
  //     path: `/recettes/${saveRecipe.data.value}`,
  //     query: {
  //       backPageURL: "/recettes"
  //     }
  //   })
  // } else {
  //   console.log("error")
  // }
  console.log(values);

  const supabase = useSupabaseClient()
  const a = await supabase.rpc("update_recipe_entirely", { recipe_object: values })
  console.log(a)
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
