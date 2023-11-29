import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { error } = await supabase.auth.updateUser({
    password: body.newPassword
  })

  useHandleSupabaseReturnError(error, event)

  return setResponseStatus(event, 201, "Password successfully updated")
})
