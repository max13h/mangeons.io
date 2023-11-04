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
            <RecipeFormKitchenEquipmentsAddCard :kitchen-equipment="kitchenEquipment"></RecipeFormKitchenEquipmentsAddCard>
          </div>
        </div>
      </div>
    </div>
    <div v-for="kitchenEquipment in kitchenEquipments" v-else :key="kitchenEquipment.id">
      <RecipeFormKitchenEquipmentsAddCard :kitchen-equipment="kitchenEquipment"></RecipeFormKitchenEquipmentsAddCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()

const kitchenEquipments = ref<Array<KitchenEquipment>>([])

const input = ref("")

// Search function
const filteredList = computed(() => {
  return kitchenEquipments.value.filter((kitchenEquipment: KitchenEquipment) =>
    kitchenEquipment.name_fr!.toLowerCase().includes(input.value.toLowerCase())
  )
})

watchEffect(() => {
  kitchenEquipments.value = recipeStore.kitchenEquipments
})
</script>

<style scoped>

</style>
