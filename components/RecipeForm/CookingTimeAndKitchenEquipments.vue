<template>
  <div>
    <FormInput
      name="cookingTime"
      type="number"
      label="Temps de préparation de votre recette (en minute) ⏲️"
      label-class="text-xl mb-4"
      placeholder="20"
      :disable-tab="true"
    >
    </FormInput>
    <p class="text-xl my-4">
      Material nécessaire à votre recette 🍳
    </p>
    <Teleport v-if="modalStore.whatIsOpen == 'addKitchenEquipments'" to="#modal">
      <RecipeFormAddKitchenEquipments></RecipeFormAddKitchenEquipments>
    </Teleport>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-secondary w-full rounded-xl p-4 overflow-y-scroll mb-7 relative">
      <p v-if="recipeStore.selectedKitchenEquipments.length == 0" class="absolute-center text-center w-7/12 italic text-slate-400">
        Aucun matériel de cuisine ajouté
      </p>
      <RecipeFormAddKitchenEquipmentsShowCard v-for="kitchenEquipment in recipeStore.selectedKitchenEquipments" v-else :key="kitchenEquipment.id" :kitchen-equipment="kitchenEquipment"></RecipeFormAddKitchenEquipmentsShowCard>
    </div>
    <button class="btn-outline-secondary w-full mb-8" tabindex="-1" @click="useAddKitchenEquipmentsModal">
      Ajouter un équipement de cuisine
      <i class="ri-add-circle-line text-xl align-middle" />
    </button>
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()
const modalStore = useModalStore()
</script>

<style scoped>
</style>
