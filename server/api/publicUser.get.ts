import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (user) {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_id", user.id)

    useHandleSupabaseReturnError(error)
    const response = useErrorIfSupabaseReturnEmptyArray(data)

    return response
  }
})
