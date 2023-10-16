import { useModalStore } from "../stores/modalStore"

export const useOpenModal = (element: string) => {
  const modalStore = useModalStore()
  modalStore.open(element)
}
