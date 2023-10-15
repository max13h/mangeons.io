<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex justify-between items-center on-click">
    <div class="flex items-center" @click="onClick">
      <img :src="props.product.image_url" :alt="props.product.name_fr" width="25">
      <p class="ms-2">
        {{ props.product.name_fr }}
      </p>
    </div>
    <i class="ri-add-circle-line text-2xl me-2" />
  </div>
</template>

<script setup lang="ts">

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
  console.log(props.product)
}
</script>

<style scoped>

</style>
