export const useOpenModal = (element: string) => {
  const modalStore = useModalStore()
  modalStore.open(element)
}

export const useIsModalOpen = (element: string) => {
  const modalStore = useModalStore()
  return modalStore.whatIsOpen === element
}
