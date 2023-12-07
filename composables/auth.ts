export const useSignUp = async (username: string, email: string, password: string) => {
  const supabase = useSupabaseClient()

  const createPublicUser = async () => {
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .insert({ username: username, user_id: authData.user.id })
      .select()

    useHandleSupabaseIssue(publicUserData, publicUserError)
  }

  const sendResetPassword = async () => {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/changer-de-mot-de-passe"
    })
    useHandleSupabaseReturnError(resetError)
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  })

  useHandleSupabaseReturnError(authError)

  if (authData && authData.user) {
    if (authData.user.identities && authData.user.identities?.length > 0) {
      createPublicUser()
    } else {
      sendResetPassword()
    }
    useNotice("Validez votre inscription en cliquant sur le lien envoyé par email", "success")
    return navigateTo("/auth/connexion")
  } else {
    useNotice("Une erreur s'est produit, veuillez réessayer", "error")
    return navigateTo("/auth/inscription")
  }
}

export const useLogOut = async () => {
  const supabase = useSupabaseClient()

  await supabase.auth.signOut()
  return navigateTo("/auth/connexion")
}

export const useIsUsernameUnique = async (username: string) => {
  const supabase = useSupabaseClient()

  const { data, error } = await supabase.from("users").select("username").eq("username", username || "null")

  useHandleSupabaseReturnError(error)

  if (data) {
    return data.length === 0
  } else {
    throw new Error("Supabase returned nothing")
  }
}

export const useGetPublicUser = async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const { data, error } = await useAsyncData("publicUser", async () => {
    if (user.value) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("user_id", user.value.id)

      useHandleSupabaseIssue(data, error)
      return data[0]
    } else {
      throw new Error("No user")
    }
  })

  useHandleFetchError(error)

  return data
}
