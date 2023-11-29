import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const username = getRouterParam(event, "username")

  const { data, error } = await supabase.from("users").select("username").eq("username", username || "null")

  useHandleSupabaseReturnError(error, event)

  if (data) {
    return data.length === 0
  } else {
    throw new Error("Supabase returned nothing")
  }
})
