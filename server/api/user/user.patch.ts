import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const { userData } = await readBody(event)

  const { error } = await supabase.from("users")
    .update({
      first_name: userData.first_name,
      last_name: userData.last_name,
      age: userData.age,
    })
    .eq("id", userData.id)

  return { error }
})
