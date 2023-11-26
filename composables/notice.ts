export const useNotice = (message: string, status: string) => {
  const noticeStore = useNoticeStore()

  noticeStore.addNotice(message, status)
}

export const useHandleFetchError = (error: globalThis.Ref<any>) => {
  if (error.value) {
    const noticeStore = useNoticeStore()
    noticeStore.addNotice("Une erreur s'est produite, veuillez réessayer plus tard", "error")
  }
}
