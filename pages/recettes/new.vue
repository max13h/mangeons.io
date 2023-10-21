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
            <NewRecipeNameAndDescription :name="name" :description="description" :errors="errors"></NewRecipeNameAndDescription>
          </swiper-slide>
          <swiper-slide>
            <NewRecipeCookingTimeAndKitchenEquipments :cooking-time="cookingTime" :errors="errors"></NewRecipeCookingTimeAndKitchenEquipments>
          </swiper-slide>
          <swiper-slide>
            <NewRecipeAlimentaryProducts></NewRecipeAlimentaryProducts>
          </swiper-slide>
          <swiper-slide>
            <NewRecipeContent :content="content" :errors="errors"></NewRecipeContent>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="flex justify-between w-full min-w-[100px] my-shadow z-20 p-4 relative bg-light">
      <button type="button" class="swiper-button-prev page-btn">
        <i class="ri-arrow-left-double-line" />
        Précedent
      </button>
      <button v-if="pageNb === 4" type="button" class="btn-secondary border-none" @click="useSaveNewRecipe">
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
import { fr } from "yup-locales"
import { object, string, number, setLocale } from "yup"
import { register } from "swiper/element/bundle"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import { useNewRecipeStore } from "../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()

setLocale(fr)
register()

definePageMeta({
  layout: "mobile-deep-focus"
})
useSetPageHeading("Votre recette")

const schema = object({
  name: string()
    .min(6, "le nom doit avoir plus de 6 caractères")
    .max(80, "le nom doit avoir moins de 80 caractères")
    .trim()
    .required("Le nom est requis"),
  description: string()
    .min(6, "la description doit avoir plus de 6 caractères")
    .max(120, "la description avoir moins de 120 caractères")
    .trim()
    .required("La description est est requise"),
  cookingTime: number()
    .max(999, "le temps de préparation de être inferieur à 999")
    .moreThan(0, "le temps de préparation doit être superieur à 0")
    .truncate()
    .required("Le temps de préparation est requis"),
  content: string()
    .min(100, "le nom doit avoir plus de 100 caractères")
    .trim()
    .required("Le contenu est est requis")
})

const { defineInputBinds, errors } = useForm({
  validationSchema: schema
})

const name = defineInputBinds("name")
const description = defineInputBinds("description")
const cookingTime = defineInputBinds("cookingTime")
const content = defineInputBinds("content")

onMounted(() => {
  watchEffect(() => {
    newRecipeStore.name = name.value.value
    newRecipeStore.description = description.value.value
    newRecipeStore.cookingTime = cookingTime.value.value
    newRecipeStore.content = content.value.value
  })
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
