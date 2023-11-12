<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex justify-between items-center on-click" @click="onClick">
    <div class="flex items-center">
      <NuxtImg :src="props.kitchenEquipment.image_url" :alt="props.kitchenEquipment.name_fr" width="25" />
      <p class="ms-2">
        {{ props.kitchenEquipment.name_fr }}
      </p>
    </div>
    <i
      class="text-2xl me-2"
      :class="recipeStore.selectedKitchenEquipments.some(obj => obj.id === props.kitchenEquipment.id) ? 'ri-check-line' : 'ri-add-circle-line'"
    />
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()

interface Props {
  kitchenEquipment: KitchenEquipment
}

const props = defineProps<Props>()

const onClick = () => {
  if (!recipeStore.selectedKitchenEquipments.some(obj => obj.id === props.kitchenEquipment.id)) {
    recipeStore.selectedKitchenEquipments.push(props.kitchenEquipment)
  }
}
</script>

<style scoped>

</style>
