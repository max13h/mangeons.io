export const useNotice = (message: string, status: string) => {
  const noticeStore = useNoticeStore()

  noticeStore.addNotice(message, status)
}
