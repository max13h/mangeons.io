export const useHandleSupabaseReturnError = (error) => {
  if (error) {
    throw new Error(`Error was returned from Supabase => \n${JSON.stringify(error)}`)
  }
}

export const useErrorIfSupabaseReturnEmptyArray = (data) => {
  if (!data || data.length === 0) {
    throw new Error("Supabase has return null or an empty array");
  } else {
    return data[0]
  }
}
