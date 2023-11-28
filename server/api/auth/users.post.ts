import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)

  const createPublicUser = async () => {
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .insert({ username: body.username, user_id: authData.user.id })
      .select()

    useHandleSupabaseIssue(publicUserData, publicUserError, event)

    console.log("publicUserData", publicUserData);
  }

  const sendResetPassword = async () => {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: "https://localhost:3000/update-password"
    })

    useHandleSupabaseReturnError(resetError, event)
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        username: body.username
      }
    }
  })
  useHandleSupabaseIssue(authData, authError, event)

  if (authData && authData.user) {
    if (authData.user.identities && authData.user.identities?.length > 0) {
      createPublicUser()
      return setResponseStatus(event, 201)
    } else {
      sendResetPassword()
      return setResponseStatus(event, 200)
    }
  }
  setResponseStatus(event, 500, "An error has occures, please contact the administrator")
})
