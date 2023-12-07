export const useHandleFetchError = (error: globalThis.Ref<any>) => {
  if (error.value) {
    useNotice("Une erreur s'est produite, veuillez réessayer plus tard", "error")
    throw new Error("An error occures durring the process", { cause: error })
  }
}

export const useHandleSupabaseReturnError = (error: any) => {
  if (error) {
    throw new Error("An error occures durring the process (005)", { cause: error })
  }
}

export const useHandleSupabaseReturnNullOrEmptyArray = (data: any) => {
  if (!data || data?.length === 0) {
    throw new Error("An error occures durring the process (006)")
  }
}

export const useHandleSupabaseIssue = (data: any, error: any) => {
  useHandleSupabaseReturnError(error)
  useHandleSupabaseReturnNullOrEmptyArray(data)
}
