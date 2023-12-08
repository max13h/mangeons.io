<template>
  <div>
    <p class="text-xl my-4 font-light">
      Material nécessaire à votre recette 🍳
    </p>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-primary w-full rounded-2xl p-4 overflow-y-scroll mb-7 relative">
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
        {{ capitalize(errorMessage) }}
      </span>
    </div>
    <button class="btn-outline-primary w-full mb-4" @click="useAddKitchenEquipmentsModal">
      Ajouter matériel de cuisine
      <Icon name="fluent:add-circle-16-regular" size="2rem" />
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
