<template>
  <div>
    <input v-model="input" type="search" name="search" placeholder="Cherchez un ingrédient" class="mb-4">
    <div v-if="input">
      <p v-if="input&&!filteredList.length" class="w-full flex justify-center items-center italic mt-4 text-slate-500">
        Aucun résultat
      </p>
      <div v-else>
        <div v-for="alimentaryProduct in filteredList" :key="alimentaryProduct.id">
          <div>
            <NewRecipeAddAlimentaryProductsAddCard :alimentary-product="alimentaryProduct"></NewRecipeAddAlimentaryProductsAddCard>
          </div>
        </div>
      </div>
    </div>
    <Disclosure v-for="storeArea in storeAreas" v-else :key="storeArea.id">
      <DisclosureButton class="disclosure-button">
        {{ storeArea.name_fr }}
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-100 ease-out"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <DisclosurePanel class="flex flex-col items-center py-3 my-2 bg-light border w-[95%] mx-auto rounded-xl">
          <div v-for="alimentaryProduct in alimentaryProducts" :key="alimentaryProduct.id" class="w-[95%]">
            <div v-if="storeArea.id === alimentaryProduct.store_area_id">
              <NewRecipeAddAlimentaryProductsAddCard :alimentary-product="alimentaryProduct"></NewRecipeAddAlimentaryProductsAddCard>
            </div>
          </div>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue"
import { useNewRecipeStore } from "../../../stores/newRecipeStore"

const newRecipeStore = useNewRecipeStore()

interface AlimentaryProduct {
  id: number;
  name_fr: string;
  store_area_id: number;
  image_url: string;
}
interface StoreArea {
  id: number;
  name: string;
  name_fr: string;
}

const alimentaryProducts = ref<Array<AlimentaryProduct>>([])
const storeAreas = ref<Array<StoreArea>>([])

const input = ref("")

const filteredList = computed(() => {
  return alimentaryProducts.value.filter((alimentaryProduct: AlimentaryProduct) =>
    alimentaryProduct.name_fr.toLowerCase().includes(input.value.toLowerCase())
  )
})

watchEffect(() => {
  alimentaryProducts.value = newRecipeStore.alimentaryProducts
  storeAreas.value = newRecipeStore.storeAreas
})

</script>

<style scoped>
.disclosure-button {
  @apply bg-slate-200 w-full my-1 rounded-md p-2 shadow
}
</style>
