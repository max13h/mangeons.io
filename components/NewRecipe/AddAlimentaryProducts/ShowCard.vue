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
        <NewRecipeAddAlimentaryProductsQuantityHint></NewRecipeAddAlimentaryProductsQuantityHint>
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
import { fr } from "yup-locales"
import { setLocale } from "yup"
import { useModalStore } from "../../../stores/modalStore"
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

setLocale(fr)
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

const schema = newRecipeStore.schemaAlimentaryProduct

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

const indexInStore = ref(newRecipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id))

const remove = () => {
  newRecipeStore.selectedAlimentaryProducts.splice(indexInStore.value, 1)
}

watch(newRecipeStore.selectedAlimentaryProducts, () => {
  indexInStore.value = newRecipeStore.selectedAlimentaryProducts.findIndex(obj => obj.details.id === props.alimentaryProduct.id)
})
watch(quantity, () => {
  newRecipeStore.selectedAlimentaryProducts[indexInStore.value].quantity = quantity.value.value
})
watch(units, () => {
  newRecipeStore.selectedAlimentaryProducts[indexInStore.value].units = units.value.value
})

</script>

<style scoped>

</style>
