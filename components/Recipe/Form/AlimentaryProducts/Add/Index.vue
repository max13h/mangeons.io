<template>
  <div>
    <input v-model="input" type="search" name="search" placeholder="Cherchez un ingrédient" class="mb-4">
    <div v-if="input">
      <p v-if="input&&!filteredList.length" class="w-full flex justify-center items-center italic mt-4 opacity-50">
        Aucun résultat
      </p>
      <div v-else>
        <div v-for="alimentaryProduct in filteredList" :key="alimentaryProduct.id">
          <div>
            <RecipeFormAlimentaryProductsAddCard :alimentary-product="alimentaryProduct"></RecipeFormAlimentaryProductsAddCard>
          </div>
        </div>
      </div>
    </div>
    <Disclosure v-for="storeArea in storeAreas" v-else :key="storeArea.id">
      <DisclosureButton class="disclosure-button relative">
        {{ storeArea.name_fr }}
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="-translate-y-16 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-out"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <DisclosurePanel class="flex flex-col items-center mt-2">
          <div v-for="alimentaryProduct in alimentaryProducts" :key="alimentaryProduct.id" class="w-[95%]">
            <div v-if="storeArea.id === alimentaryProduct.store_area_id">
              <RecipeFormAlimentaryProductsAddCard :alimentary-product="alimentaryProduct"></RecipeFormAlimentaryProductsAddCard>
            </div>
          </div>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue"

const recipeStore = useRecipeStore()

const alimentaryProducts = ref<Array<AlimentaryProduct>>([])
const storeAreas = ref<Array<StoreArea>>([])

const input = ref("")

const filteredList = computed(() => {
  return alimentaryProducts.value.filter((alimentaryProduct: AlimentaryProduct) =>
    alimentaryProduct.name_fr.toLowerCase().includes(input.value.toLowerCase())
  )
})

watchEffect(() => {
  alimentaryProducts.value = recipeStore.alimentaryProducts
  storeAreas.value = recipeStore.storeAreas
})

</script>

<style scoped>
.disclosure-button {
  @apply bg-slate-200 w-full my-1 rounded-2xl p-2 shadow-md
}
</style>
