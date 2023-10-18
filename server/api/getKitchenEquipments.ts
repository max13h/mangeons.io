import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.from("kitchen_equipments").select("id, name_fr, image_url").order("name", { ascending: true })

  return { data, error }
})
