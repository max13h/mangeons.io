<template>
  <div class="h-full flex flex-col items-center">
    <h2 class="text-xl mb-4 min-h-[56px]">
      Précisez les ingrédients requis pour votre recette 🥦
    </h2>
    <Teleport v-if="modalStore.isOpen" to="#modal">
      <NewRecipeAddIngredients></NewRecipeAddIngredients>
    </Teleport>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-secondary w-full rounded-xl p-4 overflow-y-scroll mb-2 relative">
      <p class="absolute-center text-center w-7/12 italic text-slate-400">
        Aucun ingrédient ajouté
      </p>
    </div>
    <button class="btn-outline-secondary w-full mt-5" @click="useModalAddIngredients">
      Ajouter un ingrédient
      <i class="ri-add-circle-line text-xl align-middle" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore"

const modalStore = useModalStore()
</script>

<style scoped>

</style>
