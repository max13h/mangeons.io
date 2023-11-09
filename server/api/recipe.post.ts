import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const recipeObject = await readBody(event)

  const { data, error } = await supabase.rpc("post_all_data_of_new_recipe", { recipe_data: recipeObject.recipe_data })

  useHandleSupabaseReturnError(error)
  const response = useErrorIfSupabaseReturnEmptyArray(data)

  return response
})
