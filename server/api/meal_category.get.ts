import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.from("meal_category").select("id, name_fr").order("order", { ascending: true })

  return { data, error }
})
