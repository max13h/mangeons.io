<template>
  <div>
    <input v-model="input" type="search" name="search" placeholder="Cherchez un équipement" class="mb-4">
    <div v-if="input">
      <p v-if="input&&!filteredList.length" class="w-full flex justify-center items-center italic mt-4 text-slate-500">
        Aucun résultat
      </p>
      <div v-else>
        <div v-for="equipment in filteredList" :key="equipment.id">
          <div>
            <NewRecipeAddKitchenEquipmentsAddCard :equipment="equipment"></NewRecipeAddKitchenEquipmentsAddCard>
          </div>
        </div>
      </div>
    </div>
    <div v-for="equipment in selectedKitchenEquipments" v-else :key="equipment.id">
      <NewRecipeAddKitchenEquipmentsAddCard :equipment="equipment"></NewRecipeAddKitchenEquipmentsAddCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()

interface KitchenEquipments {
  id: number;
  name_fr: string;
  image_url: string;
}

const selectedKitchenEquipments = ref<Array<KitchenEquipments>>([])

const input = ref("")

const filteredList = computed(() => {
  return selectedKitchenEquipments.value.filter((selectedKitchenEquipment: any) =>
    selectedKitchenEquipment.name_fr.toLowerCase().includes(input.value.toLowerCase())
  )
})

watchEffect(() => {
  selectedKitchenEquipments.value = newRecipeStore.kitchenEquipments
})
</script>

<style scoped>

</style>
