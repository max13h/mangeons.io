<template>
  <div class="rounded-2xl shadow-md border-2 border-slate-200 p-2  mb-2 flex flex-col justify-between items-center">
    <div class="flex justify-between w-full">
      <div class="flex items-center w-full mb-2">
        <NuxtImg :src="props.alimentaryProduct.image_url" :alt="props.alimentaryProduct.name_fr" width="25" />
        <p class="ms-2">
          {{ props.alimentaryProduct.name_fr }}
        </p>
      </div>
      <Icon name="fluent:delete-16-regular" size="1.3rem" class="cursor-pointer" @click="remove" />
    </div>
    <div class="flex flex-col w-full">
      <p class="mb-2 text-sm">
        Quantité
        <Tooltip position="bottom" class="inline" tooltip-class="!w-48">
          <p class="mb-4">
            Ajoutez une unité <strong>cohérente</strong> pour la quantité de vos ingrédients !
          </p>
          <p class="mb-2 underline">
            Exemple:
          </p>
          <p>kg / g / mg / l / cl / ml / louche / pincée / tranche / unité / boite ...</p>
        </Tooltip>
      </p>
      <div class="flex w-full justify-end items-start flex-wrap">
        <input
          v-model.number="quantity"
          type="number"
          name="quantity"
          placeholder="100"
          class="max-w-[6rem] my-1"
        >
        <div class="flex flex-col ms-4 my-1">
          <input
            v-model="unit"
            type="text"
            name="unit"
            list="unitsList"
            placeholder="g"
            class="max-w-[6rem]"
          >
          <datalist id="unitsList">
            <option v-for="unitName, index in options" :key="index" :value="unitName" />
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
  indexInStore: number
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

const quantity: globalThis.Ref<number | undefined> = ref(recipeStore.selectedAlimentaryProducts[props.indexInStore].quantity)
const unit: globalThis.Ref<string | undefined> = ref(recipeStore.selectedAlimentaryProducts[props.indexInStore].unit)

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
watch(unit, () => {
  recipeStore.selectedAlimentaryProducts[indexInStore.value].unit = unit.value
})
</script>

<style scoped>

</style>
