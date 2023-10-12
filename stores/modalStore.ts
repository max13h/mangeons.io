export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false)

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, close }
})
