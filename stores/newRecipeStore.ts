export const useNewRecipeStore = defineStore("newRecipe", () => {
  const alimentaryProduct = ref([])
  const storeAreas = ref([])

  interface Product {
    id: string;
    name_fr: string;
    store_area_id: string;
    guide_price: string;
    image_url: string;
  }

  const name: globalThis.Ref<any> = ref(undefined)
  const description: globalThis.Ref<any> = ref(undefined)
  const content: globalThis.Ref<any> = ref(undefined)
  const ingredients: globalThis.Ref<Product[]> = ref([])

  return { alimentaryProduct, storeAreas, name, description, content, ingredients }
})
