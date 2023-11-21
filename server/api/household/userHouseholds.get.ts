import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)

  const { data, error } = await supabase
    .from("households_users")
    .select("id")
    .eq("user_id", query.id)

  useHandleSupabaseReturnError(error)

  return data
})
