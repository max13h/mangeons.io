import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event) as { id: string }

  const { data, error } = await supabase
    .from("recipes_kitchen_equipments")
    .select("kitchen_equipment_id (id, name_fr, image_url)")
    .eq("recipe_id", query.id)

  return { data, error }
})
