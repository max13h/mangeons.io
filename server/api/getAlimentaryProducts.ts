import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.from("alimentary_products").select("id, name_fr, store_area_id, guide_price, image_url").order("name", { ascending: true })

  return { data, error }
})
