<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex flex-col justify-between items-center">
    <div class="flex justify-between w-full">
      <div class="flex items-center w-full mb-2">
        <img :src="props.alimentaryProduct.image_url" :alt="props.alimentaryProduct.name_fr" width="25">
        <p class="ms-2">
          {{ props.alimentaryProduct.name_fr }}
        </p>
      </div>
      <i class="ri-delete-bin-line text-lg" @click="remove" />
    </div>
    <div class="flex flex-col w-full">
      <p class="mb-2 italic">
        Quantité
        <ModalHint @click="useOpenModal('quantityHint')"></ModalHint>
      </p>
      <Teleport v-if="modalStore.whatIsOpen == 'quantityHint'" to="#modal">
        <NewRecipeAddAlimentaryProductsQuantityHint></NewRecipeAddAlimentaryProductsQuantityHint>
      </Teleport>
      <div class="flex self-end">
        <input v-model="quantity" name="quantity" type="number" placeholder="100" class="max-w-[8rem] me-2">
        <input v-model="units" name="units" type="text" placeholder="cl" class="max-w-[6rem]">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "../../../stores/modalStore"
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()
const modalStore = useModalStore()

interface AlimentaryProduct {
  id: string;
  name_fr: string;
  store_area_id: string;
  guide_price: string;
  image_url: string;
}

interface Props {
  alimentaryProduct: AlimentaryProduct
}

const props = withDefaults(defineProps<Props>(), {
  alimentaryProduct: () => ({
    id: "NULL",
    name_fr: "NULL",
    store_area_id: "NULL",
    guide_price: "NULL",
    image_url: "NULL"
  })
})

const quantity = ref("")
const units = ref("")

const indexInStore = ref(newRecipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id))

const remove = () => {
  newRecipeStore.selectedAlimentaryProducts.splice(indexInStore.value, 1)
}

watch(newRecipeStore.selectedAlimentaryProducts, () => {
  indexInStore.value = newRecipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id)
})
watch(quantity, () => {
  newRecipeStore.selectedAlimentaryProducts[indexInStore.value].quantity = quantity.value
})
watch(units, () => {
  newRecipeStore.selectedAlimentaryProducts[indexInStore.value].units = units.value
})

</script>

<style scoped>

</style>
