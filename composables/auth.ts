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

export const useChangePassword = async (newPassword: string) => {
  const { status, error } = await useFetch("/api/auth/change-password", {
    method: "patch",
    body: {
      newPassword
    }
  })

  useHandleFetchError(error)

  if (status.value === "success") {
    useNotice("Votre mot de passe à été changé avec succes", "success")
    return navigateTo("/auth/connexion")
  } else {
    useNotice("Une erreur s'est produit, veuillez réessayer", "error")
    return navigateTo("/auth/connexion")
  }
}

export const useGetPublicUser = async () => {
  const { data, error } = await useFetch("/api/publicUser")

  if (error.value) {
    throw new Error("Error during the useFetch call")
  }

  return data
}
