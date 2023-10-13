import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.from("store_areas").select("id, name_fr").order("name", { ascending: true })

  return { data, error }
})
