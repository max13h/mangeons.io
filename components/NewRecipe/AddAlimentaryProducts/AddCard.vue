<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex justify-between items-center on-click" @click="onClick">
    <div class="flex items-center">
      <NuxtImg :src="props.alimentaryProduct.image_url" :alt="props.alimentaryProduct.name_fr" width="25" />
      <p class="ms-2">
        {{ props.alimentaryProduct.name_fr }}
      </p>
    </div>
    <i
      class="text-2xl me-2"
      :class="newRecipeStore.selectedAlimentaryProducts.some(obj => obj.details.id === props.alimentaryProduct.id) ? 'ri-check-line' : 'ri-add-circle-line'"
    />
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()

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

const onClick = () => {
  if (!newRecipeStore.selectedAlimentaryProducts.some(obj => obj.details.id === props.alimentaryProduct.id)) {
    newRecipeStore.selectedAlimentaryProducts.push({
      details: props.alimentaryProduct,
      quantity: 0,
      units: ""
    })
  }
}
</script>

<style scoped>

</style>
