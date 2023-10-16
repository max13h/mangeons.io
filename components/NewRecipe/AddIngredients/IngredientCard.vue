<template>
  <div class="border-2 shadow-sm p-1 rounded-lg bg-white mb-2 flex flex-col justify-between items-center">
    <div class="flex justify-between w-full">
      <div class="flex items-center w-full mb-2">
        <img :src="props.ingredient.image_url" :alt="props.ingredient.name_fr" width="25">
        <p class="ms-2">
          {{ props.ingredient.name_fr }}
        </p>
      </div>
      <i class="ri-delete-bin-line text-lg" />
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
        <div class="max-w-[8rem] me-2">
          <FormInputText
            label=""
            type="number"
            placeholder="100"
            :model="quantity"
            name="quantity"
            error=""
          >
          </FormInputText>
        </div>
        <div class="max-w-[6rem]">
          <FormInputText
            label=""
            type="text"
            placeholder="cl"
            :model="units"
            name="quantity"
            error=""
          >
          </FormInputText>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "../../../stores/modalStore"

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

const quantity = ref(0)
const units = ref("")

const quantityHint = () => {
  useOpenModal()
}
</script>

<style scoped>

</style>
