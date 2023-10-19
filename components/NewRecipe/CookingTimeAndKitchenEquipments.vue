<template>
  <div>
    <h2 class="text-xl mb-4 min-h-[56px]">
      Indiquez le temp de préparation pour votre recette ⏲️
    </h2>
    <FormInputText
      label=""
      placeholder="20 minutes"
      name="cookingTime"
      :model="cookingTime"
      type="text"
      :error="errors.cookingTime"
    >
    </FormInputText>
    <h2 class="text-xl my-4 min-h-[56px]">
      Ainsi que le materiel nécessaire à votre recette 🍳
    </h2>
    <Teleport v-if="modalStore.whatIsOpen == 'addKitchenEquipments'" to="#modal">
      <NewRecipeAddKitchenEquipments></NewRecipeAddKitchenEquipments>
    </Teleport>
    <div class="min-h-[300px] bg-white border-dashed border-2 border-secondary w-full rounded-xl p-4 overflow-y-scroll mb-7 relative">
      <p v-if="newRecipeStore.selectedKitchenEquipments.length == 0" class="absolute-center text-center w-7/12 italic text-slate-400">
        Aucun matériel de cuisine ajouté
      </p>
      <NewRecipeAddKitchenEquipmentsShowCard v-for="kitchenEquipment in newRecipeStore.selectedKitchenEquipments" v-else :key="kitchenEquipment.id" :kitchen-equipment="kitchenEquipment"></NewRecipeAddKitchenEquipmentsShowCard>
    </div>
    <div class="pb-4">
      <button class="btn-outline-secondary w-full" tabindex="-1" @click="useAddKitchenEquipmentsModal">
        Ajouter un équipement de cuisine
        <i class="ri-add-circle-line text-xl align-middle" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../stores/newRecipeStore"
import { useModalStore } from "../../stores/modalStore"

const newRecipeStore = useNewRecipeStore()
const modalStore = useModalStore()

const props = defineProps<{
  schema: any
}>()

const { defineInputBinds, errors } = useForm({
  validationSchema: props.schema
})

const cookingTime = defineInputBinds("cookingTime")
onMounted(() => {
  watchEffect(() => {
    newRecipeStore.cookingTime = cookingTime.value.value
  })
})
</script>

<style scoped>
</style>
