<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex justify-between items-center on-click" @click="onClick">
    <div class="flex items-center">
      <img :src="props.product.image_url" :alt="props.product.name_fr" width="25">
      <p class="ms-2">
        {{ props.product.name_fr }}
      </p>
    </div>
    <i
      class="text-2xl me-2"
      :class="newRecipeStore.ingredients.includes(props.product) ? 'ri-check-line' : 'ri-add-circle-line'"
    />
  </div>
</template>

<script setup lang="ts">
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()

interface Product {
  id: string;
  name_fr: string;
  store_area_id: string;
  guide_price: string;
  image_url: string;
}

interface Props {
  product: Product
}

const props = withDefaults(defineProps<Props>(), {
  product: () => ({
    id: "NULL",
    name_fr: "NULL",
    store_area_id: "NULL",
    guide_price: "NULL",
    image_url: "NULL"
  })
})

const onClick = () => {
  if (!newRecipeStore.ingredients.includes(props.product)) {
    newRecipeStore.ingredients.push(props.product)
  }
}
</script>

<style scoped>

</style>
