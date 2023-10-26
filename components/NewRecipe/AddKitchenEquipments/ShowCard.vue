<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex flex-col justify-between items-center">
    <div class="flex justify-between w-full">
      <div class="flex items-center w-full mb-2">
        <NuxtImg :src="props.kitchenEquipment.image_url" :alt="props.kitchenEquipment.name_fr" width="25" />
        <p class="ms-2">
          {{ props.kitchenEquipment.name_fr }}
        </p>
      </div>
      <i class="ri-delete-bin-line text-lg" @click="remove" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()

interface Props {
  kitchenEquipment: {
    id: string;
    image_url: string;
    name_fr: string;
  }
}

const props = defineProps<Props>()

const indexInStore = ref(newRecipeStore.selectedKitchenEquipments.findIndex(obj => obj.id === props.kitchenEquipment.id))

const remove = () => {
  newRecipeStore.selectedKitchenEquipments.splice(indexInStore.value, 1)
}

watch(newRecipeStore.selectedKitchenEquipments, () => {
  indexInStore.value = newRecipeStore.selectedKitchenEquipments.findIndex(obj => obj.id === props.kitchenEquipment.id)
})
</script>

<style scoped>

</style>
