import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        username: body.username
      }
    }
  })
  useHandleSupabaseReturnError(authError)

  const createPublicUser = async () => {
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .insert({ username: body.username, user_id: authData.user.id })

    useHandleSupabaseReturnError(publicUserError)
  }

  const sendResetPassword = async () => {
    const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: "/update-password"
    })

    useHandleSupabaseReturnError(resetError)
  }

  if (authData && authData.user) {
    if (authData.user.identities && authData.user.identities?.length > 0) {
      createPublicUser()
      return setResponseStatus(event, 201)
    } else {
      sendResetPassword()
      return setResponseStatus(event, 200)
    }
  }
})
