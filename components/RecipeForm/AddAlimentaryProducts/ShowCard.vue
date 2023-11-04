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
      <Teleport v-if="modalStore.whatIsOpen == 'quantityHint'" to="#modal">
        <RecipeFormAddAlimentaryProductsQuantityHint></RecipeFormAddAlimentaryProductsQuantityHint>
      </Teleport>
      <div class="flex w-full justify-end items-start">
        <FormInput
          :model="quantity"
          name="quantity"
          type="number"
          placeholder="100"
          :disable-tab="true"
          :error="errors.quantity"
          class="max-w-[8rem] me-4"
        >
        </FormInput>
        <div class="flex flex-col">
          <input type="text" name="units" list="unitsList" class="max-w-[6rem]" v-bind="units">
          <datalist id="unitsList">
            <option v-for="unit, index in options" :key="index" :value="unit" />
          </datalist>
          <div class="mb-4">
            <span
              v-if="errors.units"
              class="text-red-500 text-sm"
            >
              {{ useCapitalize(errors.units) }}
            </span>
          </div>
        </div>
        <!-- <FormInput
          :model="units"
          name="units"
          type="text"
          placeholder="cl"
          class="max-w-[6rem]"
          :disable-tab="true"
        >
        </FormInput> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()
const modalStore = useModalStore()

interface Props {
  alimentaryProduct: AlimentaryProduct
}

const props = defineProps<Props>()

const schema = recipeStore.schemaAlimentaryProduct

const { defineInputBinds, errors } = useForm({
  validationSchema: schema
})

const options = [
  "kg",
  "g",
  "L",
  "cL",
  "mL",
  "tranches",
  "unités"
]

const quantity = defineInputBinds("quantity")
const units = defineInputBinds("units")

const indexInStore = ref(recipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id))

const remove = () => {
  recipeStore.selectedAlimentaryProducts.splice(indexInStore.value, 1)
}

watch(recipeStore.selectedAlimentaryProducts, () => {
  indexInStore.value = recipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id)
})
watch(quantity, () => {
  recipeStore.selectedAlimentaryProducts[indexInStore.value].quantity = quantity.value.value
})
watch(units, () => {
  recipeStore.selectedAlimentaryProducts[indexInStore.value].units = units.value.value
})

</script>

<style scoped>

</style>
