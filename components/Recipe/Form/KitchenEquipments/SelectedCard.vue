<template>
  <div class="rounded-2xl shadow-md border-2 border-slate-200 p-2 mb-2 flex flex-col justify-between items-center">
    <div class="flex justify-between items-center w-full">
      <div class="flex items-center w-full overflow-hidden">
        <NuxtImg :src="props.kitchenEquipment.image_url" :alt="props.kitchenEquipment.name_fr" width="25" />
        <p class="ms-2 break-words">
          {{ props.kitchenEquipment.name_fr }}
        </p>
      </div>
      <Icon name="fluent:delete-16-regular" size="1.3rem" class="cursor-pointer" @click="remove" />
    </div>
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()

interface Props {
  kitchenEquipment: KitchenEquipment
}

const props = defineProps<Props>()

const indexInStore = ref(recipeStore.selectedKitchenEquipments.findIndex(obj => obj.id === props.kitchenEquipment.id))

const remove = () => {
  recipeStore.selectedKitchenEquipments.splice(indexInStore.value, 1)
}

watch(recipeStore.selectedKitchenEquipments, () => {
  indexInStore.value = recipeStore.selectedKitchenEquipments.findIndex(obj => obj.id === props.kitchenEquipment.id)
})
</script>

<style scoped>

</style>
