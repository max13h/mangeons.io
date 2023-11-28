export const useHandleSupabaseReturnError = (error: any, event: any) => {
  if (error) {
    setResponseStatus(event, 500, "An error has occurred during the process. 005")
    throw new Error(
      `Error was returned from Supabase. \n => Message: ${error.message} \n => Details: ${error.details} \n`,
      { cause: error }
    )
  }
}

export const useHandleSupabaseReturnNullOrEmptyArray = (data: any, event: any) => {
  if (!data || data?.length === 0) {
    setResponseStatus(event, 500, "No data returned during the process. 006")
    throw new Error("Supabase has return null or an empty array")
  }
}

export const useHandleSupabaseIssue = (data: any, error: any, event: any) => {
  useHandleSupabaseReturnError(error, event)
  useHandleSupabaseReturnNullOrEmptyArray(data, event)
}
