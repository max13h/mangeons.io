export const useHandleSupabaseReturnError = (error) => {
  if (error) {
    throw new Error(`Error was returned from Supabase => \n${JSON.stringify(error)}`)
  }
}

export const useHandleSupabaseReturnEmptyArray = (data) => {
  if (data.length === 0) {
    return null
  } else {
    return data
  }
}
