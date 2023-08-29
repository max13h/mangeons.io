import { useAuthStore } from "../stores/authStore"

export const useLogIn = async (email: string, password: string) => {
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

export const useSignIn = async (email: string, password: string) => {
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()

  const { error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    authStore.statusMsg = _translateErrorMessage(error.message)
    authStore.isError = true
    return
  }

  const user = useSupabaseUser()
  if (user) {
    authStore.statusMsg = "Validez votre inscription en cliquant sur le lien envoyé par email."
    return navigateTo("/login")
  } else {
    authStore.statusMsg = "Une erreur est survenue"
    authStore.isError = true
  }
}

export const useArePasswordsNotSimilar = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    const authStore = useAuthStore()
    authStore.statusMsg = "Veuillez confirmez votre mot de passe"
    authStore.isError = true
    return true
  }
  return false
}

const _translateErrorMessage = (errorMsg: string) => {
  if (errorMsg === "Password should be at least 6 characters") {
    return "Le mot de passe doit contenir au moins 6 caractères"
  } else {
    return "Une erreur est survenue, veuillez réessayer"
  }
}
