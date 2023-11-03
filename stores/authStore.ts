import { object, string, ref as yupRef } from "yup"

export const useAuthStore = defineStore("auth", () => {
  const statusMsg = ref("")
  const isError = ref(false)

  const resetAuthStore = () => {
    statusMsg.value = ""
    isError.value = false
  }

  const loginSchema = object({
    email: string().email("L'email doit être valide").required("l'email est requis"),
    password: string().min(6, "Le mot de passe doit faire plus de 6 caractères").required("Le mot de passe est requis")
  })

  const registerSchema = object({
    email: string().email("L'email doit être valide").required("l'email est requis"),
    password: string().min(6, "Le mot de passe doit faire plus de 6 caractères").required("Le mot de passe est requis"),
    confirmPassword: string().oneOf([yupRef("password")], "Les mots de passe doivent être identiques")
  })

  return { statusMsg, isError, resetAuthStore, loginSchema, registerSchema }
})
