import { useModalStore } from "../stores/modalStore"

export const useModalAddIngredients = async () => {
  const modalStore = useModalStore()
  modalStore.isOpen = true

  const { data: { value: { data: alimentaryProduct } } } = await useFetch("/api/getAlimentaryProducts")
  const { data: { value: { data: storeAreas } } } = await useFetch("/api/getStoreAreas")

  modalStore.alimentaryProduct = alimentaryProduct
  modalStore.storeAreas = storeAreas
}
