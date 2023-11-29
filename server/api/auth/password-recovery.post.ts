import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
    redirectTo: "http://localhost:3000/profil/changer-de-mot-de-passe"
  })

  useHandleSupabaseReturnError(error, event)

  return setResponseStatus(event, 201, "Email successfully sent")
})
