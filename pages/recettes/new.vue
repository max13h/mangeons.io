<template>
  <div class="flex flex-col items-center h-full">
    <p class="mb-4 text-center rounded-md bg-primary-100 p-2">
      Renseignez les infomations concernant votre nouvelle recette !
    </p>

    <div class="w-full overflow-hidden flex-grow ">
      <swiper
        class="h-full"
        :allow-touch-move="false"
        :space-between="30"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }"
      >
        <swiper-slide>
          <NewRecipeName :schema="schema"></NewRecipeName>
        </swiper-slide>
        <swiper-slide>
          <NewRecipeDescription :schema="schema"></NewRecipeDescription>
        </swiper-slide>
        <swiper-slide>
          <NewRecipeIngredients></NewRecipeIngredients>
        </swiper-slide>
        <swiper-slide>
          <NewRecipeContent :schema="schema"></NewRecipeContent>
          <button type="button" class="btn-secondary w-full mt-4">
            Sauvegarder
            <i class="ri-save-3-line" />
          </button>
        </swiper-slide>
      </swiper>
    </div>
    <div class="flex justify-between w-full min-w-[100px]">
      <button type="button" class="swiper-button-prev pag-btn">
        <i class="ri-arrow-left-double-line" />
        Précedent
      </button>
      <button type="button" class="swiper-button-next pag-btn">
        Suivant
        <i class="ri-arrow-right-double-line" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fr } from "yup-locales"
import { object, string, setLocale } from "yup"
import { register } from "swiper/element/bundle"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"

setLocale(fr)
register()

definePageMeta({
  layout: "mobile-focus"
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
  content: string()
    .min(100, "le nom doit avoir plus de 100 caractères")
    .trim()
    .required("Le contenu est est requis")
})

</script>

<style scoped>
.pag-btn {
  @apply p-2 bg-primary-100 rounded-lg min-w-[100px]
}

.swiper-button-disabled{
    @apply opacity-0
}

swiper-slide {
  margin-top: 3rem;
}
</style>
