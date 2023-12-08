<template>
  <div class="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-2 py mb-2 flex justify-between items-center on-click" @click="onClick">
    <div class="flex items-center overflow-hidden">
      <NuxtImg :src="props.alimentaryProduct.image_url" :alt="props.alimentaryProduct.name_fr" width="25" />
      <p class="ms-2 break-word">
        {{ props.alimentaryProduct.name_fr }}
      </p>
    </div>
    <Icon :name="recipeStore.selectedAlimentaryProducts.some(obj => obj.details.id === props.alimentaryProduct.id) ? 'fluent:checkmark-16-regular' : 'fluent:add-circle-16-regular'" :size="recipeStore.selectedAlimentaryProducts.some(obj => obj.details.id === props.alimentaryProduct.id) ? '1.3rem' : '1.6rem'" class="w-8" />
  </div>
</template>

<script setup lang="ts">
const recipeStore = useRecipeStore()

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
  if (!recipeStore.selectedAlimentaryProducts.some(obj => obj.details.id === props.alimentaryProduct.id)) {
    recipeStore.selectedAlimentaryProducts.push({
      details: props.alimentaryProduct,
      quantity: 0,
      unit: ""
    })
  }
}
</script>

<style scoped>

</style>
