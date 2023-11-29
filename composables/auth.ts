export const useLogIn = async (email: any, password: any) => {
  const supabase = useSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  const noticeStore = useNoticeStore()
  const user = useSupabaseUser()

  if (!error && user) {
    noticeStore.addNotice("Connexion réussie, bon retour parmi nous !", "success")
    return navigateTo("/menus")
  } else {
    noticeStore.addNotice("Une erreur s'est produit, veuillez réessayer", "error")
    return navigateTo("/auth/connexion")
  }
}

export const useSignUp = async (username: string, email: string, password: string) => {
  const { status, error } = await useFetch("/api/auth/users", {
    method: "post",
    body: {
      username,
      email,
      password
    }
  })

  useHandleFetchError(error)

  const noticeStore = useNoticeStore()

  if (status.value === "success") {
    noticeStore.addNotice("Validez votre inscription en cliquant sur le lien envoyé par email", "success")
    return navigateTo("/auth/connexion")
  } else {
    noticeStore.addNotice("Une erreur s'est produit, veuillez réessayer", "error")
    return navigateTo("/auth/inscription")
  }
}

export const usePasswordRecovery = async (email: string) => {
  const { status, error } = await useFetch("/api/auth/password-recovery", {
    method: "post",
    body: {
      email
    }
  })

  useHandleFetchError(error)

  const noticeStore = useNoticeStore()

  if (status.value === "success") {
    noticeStore.addNotice("Cliquez sur le lien reçu par email pour récuperer votre compte", "success")
    return navigateTo("/auth/connexion")
  } else {
    noticeStore.addNotice("Une erreur s'est produit, veuillez réessayer", "error")
    return navigateTo("/auth/mot-de-passe-oublie")
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

  const noticeStore = useNoticeStore()

  if (status.value === "success") {
    noticeStore.addNotice("Votre mot de passe à été changé avec succes", "success")
    return navigateTo("/auth/connexion")
  } else {
    noticeStore.addNotice("Une erreur s'est produit, veuillez réessayer", "error")
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
