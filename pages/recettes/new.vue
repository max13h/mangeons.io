<template>
  <div class="flex flex-col items-center h-full">
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
        >
          <swiper-slide>
            <RecipeFormNameAndDescription></RecipeFormNameAndDescription>
          </swiper-slide>
          <swiper-slide>
            <RecipeFormCookingTimeAndKitchenEquipments></RecipeFormCookingTimeAndKitchenEquipments>
          </swiper-slide>
          <swiper-slide>
            <RecipeFormAlimentaryProducts></RecipeFormAlimentaryProducts>
          </swiper-slide>
          <swiper-slide>
            <RecipeFormContent @update-content="updateContent"></RecipeFormContent>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="flex justify-between w-full min-w-[100px] my-shadow z-20 p-4 relative bg-light">
      <button type="button" class="swiper-button-prev page-btn">
        <i class="ri-arrow-left-double-line" />
        Précedent
      </button>
      <button v-if="pageNb === 4" type="button" class="btn-secondary border-none" @click="onSubmit">
        Enregistrer
        <i class="ri-save-3-line" />
      </button>
      <button type="button" class="swiper-button-next page-btn" :class="{'hidden': pageNb === 4}">
        Suivant
        <i class="ri-arrow-right-double-line" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { register } from "swiper/element/bundle"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"

const recipeStore = useRecipeStore()

register()

definePageMeta({
  layout: "mobile-deep-focus"
})

const { handleSubmit } = useForm({
  validationSchema: recipeStore.schemaNewRecipe
})

const updateContent = (updatedContent: string) => {
  recipeStore.content = updatedContent
}

onMounted(() => {
  watchEffect(() => {
  })
})

const onSubmit = handleSubmit((values) => {
  console.log("ça passe", values);
})

const pageNb = ref(1)
</script>

<style scoped>
.page-btn {
  @apply p-2 bg-primary-100 rounded-lg min-w-[100px]
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
