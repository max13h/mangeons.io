import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from("recipes")
    .select("id,name,cooking_time, description, image_url")
    .eq("is_public", true)

  useHandleSupabaseReturnError(error)

  if (!data) {
    throw new Error("Supabase has return null")
  } else {
    return data
  }
})
