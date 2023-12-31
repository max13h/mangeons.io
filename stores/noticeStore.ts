export const useNoticeStore = defineStore("notice", () => {
  const notices: globalThis.Ref<Notice[]> = ref([])

  const addNotice = (message: string, status: string = "default") => {
    notices.value.push({
      id: Math.random().toString(36).substring(2),
      message,
      status
    })
  }

  const removeNotice = (id: string) => {
    notices.value = notices.value.filter(notice => notice.id !== id)
  }

  return { notices, addNotice, removeNotice }
})
