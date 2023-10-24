import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)

  const { data, error } = await supabase.from("recipes").select("id, name, author, is_public, description, content, cooking_time").eq("id", query.id)

  return { data, error }
})
