<template>
  <div>
    <input v-model="input" type="search" name="search" placeholder="Cherchez un équipement" class="mb-4">
    <div v-if="input">
      <p v-if="input&&!filteredList.length" class="w-full flex justify-center items-center italic mt-4 text-slate-500">
        Aucun résultat
      </p>
      <div v-else>
        <div v-for="kitchenEquipment in filteredList" :key="kitchenEquipment.id">
          <div>
            <RecipeFormAddKitchenEquipmentsAddCard :kitchen-equipment="kitchenEquipment"></RecipeFormAddKitchenEquipmentsAddCard>
          </div>
        </div>
      </div>
    </div>
    <div v-for="kitchenEquipment in selectedKitchenEquipments" v-else :key="kitchenEquipment.id">
      <RecipeFormAddKitchenEquipmentsAddCard :kitchen-equipment="kitchenEquipment"></RecipeFormAddKitchenEquipmentsAddCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecipeStore } from "../../../stores/recipeStore"

const recipeStore = useRecipeStore()

const selectedKitchenEquipments = ref<Array<KitchenEquipment>>([])

const input = ref("")

const filteredList = computed(() => {
  return selectedKitchenEquipments.value.filter((selectedKitchenEquipment: KitchenEquipment) =>
    selectedKitchenEquipment.name_fr.toLowerCase().includes(input.value.toLowerCase())
  )
})

watchEffect(() => {
  selectedKitchenEquipments.value = recipeStore.kitchenEquipments
})
</script>

<style scoped>

</style>
