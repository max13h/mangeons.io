import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const recipeObject = await readBody(event)

  const { data, error } = await supabase.rpc("get_all_data_of_recipe", { recipe_id: recipeObject.id })

  return data
})
