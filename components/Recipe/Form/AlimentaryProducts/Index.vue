<template>
  <div>
    <Teleport v-if="modalStore.whatIsOpen == 'addAlimentaryProducts'" to="#modal">
      <RecipeFormAlimentaryProductsAdd></RecipeFormAlimentaryProductsAdd>
    </Teleport>
    <Teleport v-if="modalStore.whatIsOpen == 'quantityHint'" to="#modal">
      <RecipeFormAlimentaryProductsAddQuantityHint></RecipeFormAlimentaryProductsAddQuantityHint>
    </Teleport>

    <h2 class="text-xl mb-4 self-start">
      Précisez les ingrédients requis pour votre recette 🥦
    </h2>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-primary w-full rounded-xl p-4 overflow-y-scroll mb-7 relative">
      <p v-if="recipeStore.selectedAlimentaryProducts.length == 0" class="absolute-center text-center w-7/12 italic text-slate-400">
        Aucun ingrédient ajouté
      </p>
      <RecipeFormAlimentaryProductsSelectedCard
        v-for="(alimentaryProduct, index) in recipeStore.selectedAlimentaryProducts"
        v-else
        :key="alimentaryProduct.details.id"
        :alimentary-product="alimentaryProduct.details"
        :index-in-store="index"
      />
    </div>
    <div class="mb-4">
      <span
        v-if="errorMessage"
        class="text-red-500 text-sm"
      >
        {{ capitalize(errorMessage) }}
      </span>
    </div>
    <button class="btn-outline-primary w-full mb-8" @click="useAddAlimentaryProductsModal">
      Ajouter un ingrédient
      <i class="ri-add-circle-line text-xl align-middle" />
    </button>
  </div>
</template>

<script setup lang="ts">
const modalStore = useModalStore()
const recipeStore = useRecipeStore()

const { value, errorMessage } = useField("selectedAlimentaryProducts")

watch(recipeStore.selectedAlimentaryProducts, () => {
  value.value = recipeStore.selectedAlimentaryProducts
})

onMounted(() => {
  value.value = recipeStore.selectedAlimentaryProducts
})
</script>

<style scoped>

</style>
