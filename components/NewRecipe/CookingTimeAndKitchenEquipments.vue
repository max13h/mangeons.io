<template>
  <div>
    <FormInput
      label="Temps de préparation de votre recette (en minute) ⏲️"
      label-class="text-xl mb-4"
      :model="props.cookingTime"
      type="number"
      name="cookingTime"
      :error="props.errors.cookingTime"
      placeholder="20"
      :disable-tab="true"
    >
    </FormInput>
    <p class="text-xl my-4">
      Material nécessaire à votre recette 🍳
    </p>
    <Teleport v-if="modalStore.whatIsOpen == 'addKitchenEquipments'" to="#modal">
      <NewRecipeAddKitchenEquipments></NewRecipeAddKitchenEquipments>
    </Teleport>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-secondary w-full rounded-xl p-4 overflow-y-scroll mb-7 relative">
      <p v-if="newRecipeStore.selectedKitchenEquipments.length == 0" class="absolute-center text-center w-7/12 italic text-slate-400">
        Aucun matériel de cuisine ajouté
      </p>
      <NewRecipeAddKitchenEquipmentsShowCard v-for="kitchenEquipment in newRecipeStore.selectedKitchenEquipments" v-else :key="kitchenEquipment.id" :kitchen-equipment="kitchenEquipment"></NewRecipeAddKitchenEquipmentsShowCard>
    </div>
    <div class="pb-4">
      <button class="btn-outline-secondary w-full" tabindex="-1" @click="useAddKitchenEquipmentsModal">
        Ajouter un équipement de cuisine
        <i class="ri-add-circle-line text-xl align-middle" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore"
import { useNewRecipeStore } from "../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()
const modalStore = useModalStore()

const props = defineProps<{
  cookingTime: any;
  errors: any
}>()
</script>

<style scoped>
</style>
