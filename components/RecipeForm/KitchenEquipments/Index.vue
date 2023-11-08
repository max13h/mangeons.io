<template>
  <div>
    <p class="text-xl my-4">
      Material nécessaire à votre recette 🍳
    </p>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-secondary w-full rounded-xl p-4 overflow-y-scroll mb-7 relative">
      <p v-if="recipeStore.selectedKitchenEquipments.length == 0" class="absolute-center text-center w-7/12 italic text-slate-400">
        Aucun matériel de cuisine ajouté
      </p>
      <RecipeFormKitchenEquipmentsSelectedCard
        v-for="kitchenEquipment in recipeStore.selectedKitchenEquipments"
        v-else
        :key="kitchenEquipment.id"
        :kitchen-equipment="kitchenEquipment"
      />
    </div>
    <div class="mb-4">
      <span
        v-if="errorMessage"
        class="text-red-500 text-sm"
      >
        {{ useCapitalize(errorMessage) }}
      </span>
    </div>
    <button class="btn-outline-secondary w-full mb-4" tabindex="-1" @click="useAddKitchenEquipmentsModal">
      Ajouter un équipement de cuisine
      <i class="ri-add-circle-line text-xl align-middle" />
    </button>
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()

const { value, errorMessage } = useField(() => "selectedKitchenEquipments")

value.value = []

watch(recipeStore.selectedKitchenEquipments, () => {
  value.value = recipeStore.selectedKitchenEquipments
})

onMounted(() => {
  value.value = recipeStore.selectedKitchenEquipments
})
</script>

<style scoped>

</style>
