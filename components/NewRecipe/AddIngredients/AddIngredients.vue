<template>
  <div>
    <input v-model="input" type="search" name="search" placeholder="Cherchez un ingrédient" class="mb-4">
    <div v-if="input">
      <p v-if="input&&!filteredList.length" class="w-full flex justify-center items-center italic mt-4 text-slate-500">
        Aucun résultat
      </p>
      <div v-else>
        <div v-for="product in filteredList" :key="product.id">
          <div>
            <NewRecipeAddIngredientsCard :product="product" @productClicked="(i) => run(i)"></NewRecipeAddIngredientsCard>
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
          <div v-for="product in alimentaryProduct" :key="product.id" class="w-[95%]">
            <div v-if="storeArea.id === product.store_area_id">
              <NewRecipeAddIngredientsCard :product="product" @product-clicked="(i) => console.log(i)"></NewRecipeAddIngredientsCard>
            </div>
          </div>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue"
import { useModalStore } from "../../../stores/modalStore"

const modalStore = useModalStore()

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

const alimentaryProduct = ref<Array<AlimentaryProduct>>(undefined)
const storeAreas = ref<Array<StoreArea>>(undefined)

const input = ref("")

const filteredList = computed(() => {
  return alimentaryProduct.filter((product: AlimentaryProduct) =>
    product.name_fr.toLowerCase().includes(input.value.toLowerCase())
  )
})

const handleProductClicked = (i) => {

}

watchEffect(() => {
  alimentaryProduct.value = modalStore.alimentaryProduct
  storeAreas.value = modalStore.storeAreas
})

</script>

<style scoped>
.disclosure-button {
  @apply bg-slate-200 w-full my-1 rounded-md p-2 shadow
}
</style>
