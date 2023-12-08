<template>
  <div class="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-2 py mb-2 flex justify-between items-center on-click" @click="onClick">
    <div class="flex items-center me-2 overflow-hidden">
      <NuxtImg :src="props.kitchenEquipment.image_url" :alt="props.kitchenEquipment.name_fr" width="25" />
      <p class="ms-2 break-word">
        {{ props.kitchenEquipment.name_fr }}
      </p>
    </div>
    <Icon :name="recipeStore.selectedKitchenEquipments.some(obj => obj.id === props.kitchenEquipment.id) ? 'fluent:checkmark-16-regular' : 'fluent:add-circle-16-regular'" :size="recipeStore.selectedKitchenEquipments.some(obj => obj.id === props.kitchenEquipment.id) ? '1.3rem' : '1.6rem'" class="w-8" />
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
