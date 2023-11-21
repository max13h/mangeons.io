import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)

  const { data, error } = await supabase.rpc("get_all_data_of_households", { public_user_id: query.id })

  useHandleSupabaseReturnError(error)

  return data
})
