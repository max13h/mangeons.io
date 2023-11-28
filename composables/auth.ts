export const redirectIfAuthenticated = async () => {
  const user = useSupabaseUser()

  if (user.value) {
    await navigateTo("/menus")
  }
}

export const useLogIn = async (email: any, password: any) => {
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    authStore.statusMsg = "Email ou mot de passe incorrect"
    authStore.isError = true
    return
  }

  const user = useSupabaseUser()
  if (user) {
    return navigateTo("/menus")
  } else {
    authStore.statusMsg = "Une erreur est survenue"
    authStore.isError = true
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
    return navigateTo("/login")
  } else {
    noticeStore.addNotice("Une erreur s'est produit, veuillez réessayer", "error")
    return navigateTo("/register")
  }
}

export const useArePasswordsNotSimilar = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    const authStore = useAuthStore()
    authStore.statusMsg = "Une erreur est survenue, veuillez réessayer"
    authStore.isError = true
    return true
  }
  return false
}

export const useGetPublicUser = async () => {
  const { data, error } = await useFetch("/api/publicUser")

  if (error.value) {
    throw new Error("Error during the useFetch call")
  }

  return data
}
