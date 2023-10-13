export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false)

  const alimentaryProduct = ref([])
  const storeAreas = ref([])

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, alimentaryProduct, storeAreas, close }
})
