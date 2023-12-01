export const useNotice = (message: string, status: string) => {
  const noticeStore = useNoticeStore()

  noticeStore.addNotice(message, status)
}

export const useHandleFetchError = (error: globalThis.Ref<any>) => {
  if (error.value) {
    useNotice("Une erreur s'est produite, veuillez réessayer plus tard", "error")
    throw new Error("An error occures durring the process", { cause: error })
  }
}

export const useHandleSupabaseReturnError = (error: any) => {
  if (error) {
    useNotice("Une erreur s'est produite, veuillez réessayer plus tard (005)", "error")
    throw new Error("An error occures durring the process (005)", { cause: error })
  }
}

export const useHandleSupabaseReturnNullOrEmptyArray = (data: any) => {
  if (!data || data?.length === 0) {
    useNotice("Une erreur s'est produite, veuillez réessayer plus tard (006)", "error")
    throw new Error("An error occures durring the process (006)")
  }
}

export const useHandleSupabaseIssue = (data: any, error: any) => {
  useHandleSupabaseReturnError(error)
  useHandleSupabaseReturnNullOrEmptyArray(data)
}
