<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex flex-col justify-between items-center">
    <div class="flex justify-between w-full">
      <div class="flex items-center w-full mb-2">
        <img :src="props.ingredient.image_url" :alt="props.ingredient.name_fr" width="25">
        <p class="ms-2">
          {{ props.ingredient.name_fr }}
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
        <p class="mb-4">
          Ajoutez une unité <strong>cohérente</strong> pour la quantité de vos ingrédients !
        </p>
        <p class="mb-2 underline">
          Exemple:
        </p>
        <p>kg / g / mg / l / cl / ml / louche / pincée / tranche / unité / boite ...</p>
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

interface Ingredient {
  id: string;
  name_fr: string;
  store_area_id: string;
  guide_price: string;
  image_url: string;
}

interface Props {
  ingredient: Ingredient
}

const props = withDefaults(defineProps<Props>(), {
  ingredient: () => ({
    id: "NULL",
    name_fr: "NULL",
    store_area_id: "NULL",
    guide_price: "NULL",
    image_url: "NULL"
  })
})

const quantity = ref("")
const units = ref("")

const indexInStore = ref(newRecipeStore.ingredients.findIndex(obj => obj.details.id === props.ingredient.id))

const remove = () => {
  newRecipeStore.ingredients.splice(indexInStore.value, 1)
}

watch(newRecipeStore.ingredients, () => {
  indexInStore.value = newRecipeStore.ingredients.findIndex(obj => obj.details.id === props.ingredient.id)
})
watch(quantity, () => {
  newRecipeStore.ingredients[indexInStore.value].quantity = quantity.value
})
watch(units, () => {
  newRecipeStore.ingredients[indexInStore.value].units = units.value
})

</script>

<style scoped>

</style>
