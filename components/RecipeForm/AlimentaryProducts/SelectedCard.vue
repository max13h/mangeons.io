<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex flex-col justify-between items-center">
    <div class="flex justify-between w-full">
      <div class="flex items-center w-full mb-2">
        <NuxtImg :src="props.alimentaryProduct.image_url" :alt="props.alimentaryProduct.name_fr" width="25" />
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
      <div class="flex w-full justify-end items-start">
        <input
          v-model.number="quantity"
          type="number"
          name="quantity"
          placeholder="100"
          class="max-w-[6rem] me-4"
          tabindex="-1"
        >
        <div class="flex flex-col">
          <input
            v-model="units"
            type="text"
            name="units"
            list="unitsList"
            placeholder="g"
            class="max-w-[6rem]"
            tabindex="-1"
          >
          <datalist id="unitsList">
            <option v-for="unit, index in options" :key="index" :value="unit" />
          </datalist>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()

interface Props {
  alimentaryProduct: AlimentaryProduct
}
const props = defineProps<Props>()

const options = [
  "kg",
  "g",
  "L",
  "cL",
  "mL",
  "tranches",
  "unités"
]

const quantity: globalThis.Ref<number | undefined> = ref(undefined)
const units: globalThis.Ref<string> = ref("")

const indexInStore = ref(recipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id))

const remove = () => {
  recipeStore.selectedAlimentaryProducts.splice(indexInStore.value, 1)
}

watch(recipeStore.selectedAlimentaryProducts, () => {
  indexInStore.value = recipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id)
})
watch(quantity, () => {
  if (typeof quantity.value !== "number") {
    quantity.value = undefined
  }
  recipeStore.selectedAlimentaryProducts[indexInStore.value].quantity = quantity.value
})
watch(units, () => {
  recipeStore.selectedAlimentaryProducts[indexInStore.value].units = units.value
})
</script>

<style scoped>

</style>
