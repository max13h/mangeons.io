export const useNewRecipeStore = defineStore("newRecipe", () => {
  const alimentaryProduct: globalThis.Ref<any[]> = ref([])
  const storeAreas: globalThis.Ref<any[]> = ref([])
  const kitchenEquipments: globalThis.Ref<any[]> = ref([])

  const name: globalThis.Ref<string> = ref("")
  const description: globalThis.Ref<string> = ref("")
  const content: globalThis.Ref<string> = ref("")
  const ingredients: globalThis.Ref<object[]> = ref([])
  const selectedKitchenEquipments: globalThis.Ref<object[]> = ref([])
  const cookingTime: globalThis.Ref<string> = ref("")

  return { alimentaryProduct, storeAreas, kitchenEquipments, name, description, content, ingredients, selectedKitchenEquipments, cookingTime }
})
