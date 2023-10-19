<template>
  <div class="h-full flex flex-col items-center">
    <h2 class="text-xl mb-4 self-start">
      Précisez les ingrédients requis pour votre recette 🥦
    </h2>
    <Teleport v-if="modalStore.whatIsOpen == 'addAlimentaryProducts'" to="#modal">
      <NewRecipeAddAlimentaryProducts></NewRecipeAddAlimentaryProducts>
    </Teleport>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-secondary w-full rounded-xl p-4 overflow-y-scroll mb-7 relative">
      <p v-if="newRecipeStore.selectedAlimentaryProducts.length == 0" class="absolute-center text-center w-7/12 italic text-slate-400">
        Aucun ingrédient ajouté
      </p>
      <NewRecipeAddAlimentaryProductsShowCard v-for="alimentaryProduct in newRecipeStore.selectedAlimentaryProducts" v-else :key="alimentaryProduct.details.id" :alimentary-product="alimentaryProduct.details"></NewRecipeAddAlimentaryProductsShowCard>
    </div>
    <div class="pb-4">
      <button class="btn-outline-secondary w-full" tabindex="-1" @click="useAddAlimentaryProductsModal">
        Ajouter un ingrédient
        <i class="ri-add-circle-line text-xl align-middle" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore"
import { useNewRecipeStore } from "../../stores/newRecipeStore"

const modalStore = useModalStore()
const newRecipeStore = useNewRecipeStore()
</script>

<style scoped>

</style>
