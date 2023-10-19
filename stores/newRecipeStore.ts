export const useNewRecipeStore = defineStore("newRecipe", () => {
  const alimentaryProducts: globalThis.Ref<any[]> = ref([])
  const storeAreas: globalThis.Ref<any[]> = ref([])
  const kitchenEquipments: globalThis.Ref<any[]> = ref([])

  interface SelectedAlimentaryProduct {
    details: {
      id: string;
      name_fr: string;
      store_area_id: string;
      guide_price: string;
      image_url: string;
    };
    quantity: number;
    units: string;
  }
  interface SelectedKitchenEquipment {
    id: string;
    image_url: string;
    name_fr: string;
  }

  const name: globalThis.Ref<string> = ref("")
  const description: globalThis.Ref<string> = ref("")
  const content: globalThis.Ref<string> = ref("")
  const cookingTime: globalThis.Ref<string> = ref("")
  const selectedKitchenEquipments: globalThis.Ref<SelectedKitchenEquipment[]> = ref([])
  const selectedAlimentaryProducts: globalThis.Ref<SelectedAlimentaryProduct[]> = ref([])

  return { alimentaryProducts, storeAreas, kitchenEquipments, name, description, content, selectedAlimentaryProducts, selectedKitchenEquipments, cookingTime }
})
