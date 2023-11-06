import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event) as { id: string }

  const { data, error } = await supabase
    .from("recipes_alimentary_products")
    .select("alimentary_product_id (name_fr, image_url), quantity, unit")
    .eq("recipe_id", query.id)

  return { data, error }
})
