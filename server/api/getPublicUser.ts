import { serverSupabaseClient } from "#supabase/server"
import { serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  const { data, error } = await supabase
    .from("users")
    .select("id, username, first_name, last_name, age, household_id")
    .eq("user_id", user.id)

  return { data, error }
})
