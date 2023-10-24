import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from("recipes")
    .select("id,name,cooking_time, description")

  return { data, error }
})
