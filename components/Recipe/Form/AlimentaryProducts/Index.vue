<template>
  <div>
    <Teleport v-if="useIsModalOpen('addAlimentaryProducts')" to="#modal">
      <RecipeFormAlimentaryProductsAdd></RecipeFormAlimentaryProductsAdd>
    </Teleport>
    <p class="text-xl my-4 font-light ms-2">
      Précisez les ingrédients requis pour votre recette 🥦
    </p>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-primary w-full rounded-2xl p-4 relative">
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
    <div class="mb-7">
      <span
        v-if="errorMessage"
        class="text-red-500 text-sm"
      >
        {{ capitalize(errorMessage) }}
      </span>
    </div>
    <button class="btn-outline-primary w-full mb-8" @click="useAddAlimentaryProductsModal">
      Ajouter un ingrédient
      <Icon name="fluent:add-circle-16-regular" size="2rem" />
    </button>
  </div>
</template>

<script setup lang="ts">
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
