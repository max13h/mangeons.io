<template>
  <div>
    <Teleport
      v-if="modalStore.whatIsOpen == 'addKitchenEquipments'"
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
      :disable-tab="true"
      :value="props.cookingTime"
    />
    <RecipeFormKitchenEquipments />
  </div>
</template>

<script setup lang="ts">
const modalStore = useModalStore()

const props = defineProps<{
  cookingTime?: number
}>()
</script>

<style scoped>
</style>
