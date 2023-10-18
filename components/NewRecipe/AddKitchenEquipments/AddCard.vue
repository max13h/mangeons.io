<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex justify-between items-center on-click" @click="onClick">
    <div class="flex items-center">
      <img :src="props.equipment.image_url" :alt="props.equipment.name_fr" width="25">
      <p class="ms-2">
        {{ props.equipment.name_fr }}
      </p>
    </div>
    <i
      class="text-2xl me-2"
      :class="newRecipeStore.selectedKitchenEquipments.some(obj => obj === props.equipment) ? 'ri-check-line' : 'ri-add-circle-line'"
    />
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()

interface Equipment {
  id: string;
  name_fr: string;
  image_url: string;
}

interface Props {
  equipment: Equipment
}

const props = withDefaults(defineProps<Props>(), {
  equipment: () => ({
    id: "NULL",
    name_fr: "NULL",
    image_url: "NULL"
  })
})

const onClick = () => {
  if (!newRecipeStore.selectedKitchenEquipments.some(obj => obj === props.equipment)) {
    newRecipeStore.selectedKitchenEquipments.push(props.equipment)
  }
}
</script>

<style scoped>

</style>
