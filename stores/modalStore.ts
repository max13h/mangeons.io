export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false)
  const whatIsOpen = ref("")

  const open = (element: string) => {
    isOpen.value = true
    whatIsOpen.value = element
  }

  const close = () => {
    isOpen.value = false
    whatIsOpen.value = ""
  }

  return { isOpen, whatIsOpen, open, close }
})
