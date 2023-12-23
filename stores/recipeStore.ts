export const useRecipeStore = defineStore("recipe", () => {
  const alimentaryProducts: globalThis.Ref<any[]> = ref([])
  const storeAreas: globalThis.Ref<any[]> = ref([])
  const kitchenEquipments: globalThis.Ref<any[]> = ref([])

  const selectedKitchenEquipments: globalThis.Ref<KitchenEquipment[]> = ref([])
  const selectedAlimentaryProducts: globalThis.Ref<SelectedAlimentaryProduct[]> = ref([])

  return {
    alimentaryProducts,
    storeAreas,
    kitchenEquipments,
    selectedAlimentaryProducts,
    selectedKitchenEquipments
  }
})
