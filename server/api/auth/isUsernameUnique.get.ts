import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)

  const { data, error } = await supabase.from("users").select("username").eq("username", query.username)

  useHandleSupabaseReturnError(error)

  if (data) {
    return data.length === 0
  } else {
    throw new Error("Supabase returned nothing")
  }
})
