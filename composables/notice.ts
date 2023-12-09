export const useNotice = (message: string, status: string) => {
  const noticeStore = useNoticeStore()

  noticeStore.addNotice(message, status)
}

export const useErrorNotice = () => {
  useNotice("Une erreur s'est produite, veuillez réessayer plus tard", "error")
}
