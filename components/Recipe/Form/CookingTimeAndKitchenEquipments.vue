<template>
  <div>
    <Teleport
      v-if="useIsModalOpen('addKitchenEquipments')"
      to="#modal"
    >
      <RecipeFormKitchenEquipmentsAdd />
    </Teleport>

    <FormInput
      name="cookingTime"
      type="number"
      label="Temps de préparation de votre recette (en minute) ⏲️"
      label-class="text-xl mb-4"
      placeholder="20"
      :disable-tab="false"
      :value="props.cookingTime"
    />
    <RecipeFormKitchenEquipments />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  cookingTime?: number
}>()
</script>

<style scoped>
</style>
