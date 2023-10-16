import { useNewRecipeStore } from "../stores/newRecipeStore"

export const useAddIngredientsModal = async () => {
  const newRecipeStore = useNewRecipeStore()

  useOpenModal("addIngredients")

  const { data: { value: { data: alimentaryProduct } } } = await useFetch("/api/getAlimentaryProducts")
  const { data: { value: { data: storeAreas } } } = await useFetch("/api/getStoreAreas")

  newRecipeStore.alimentaryProduct = alimentaryProduct
  newRecipeStore.storeAreas = storeAreas
}
