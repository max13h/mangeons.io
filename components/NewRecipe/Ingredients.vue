<template>
  <div class="h-full flex flex-col items-center">
    <h2 class="text-xl mb-8">
      Précisez les ingrédients requis pour votre recette 🥦
    </h2>
    <button class="btn-primary" @click="useModalAddIngredients">
      Ajouter un ingrédient
      <i class="ri-add-circle-line text-2xl align-middle" />
    </button>
    <Teleport v-if="modalStore.isOpen" to="#modal">
      <NewRecipeAddIngredients></NewRecipeAddIngredients>
    </Teleport>
    <div class="flex-grow bg-white border-dashed border-2 border-secondary w-full rounded-xl my-4 p-4">
      hello
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore"

const modalStore = useModalStore()
</script>

<style scoped>

</style>
