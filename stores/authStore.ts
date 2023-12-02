import { object, string, ref as yupRef } from "yup"

export const useAuthStore = defineStore("auth", () => {
  const loginSchema = object({
    email: string().email("L'email doit être valide").required("l'email est requis"),
    password: string().min(6, "Le mot de passe doit faire plus de 6 caractères").required("Le mot de passe est requis")
  })

  const registerSchema = object({
    username: string()
      .min(3, "le nom d'utilisateur doit avoir plus de 3 caractères")
      .max(18, "le nom d'utilisateur doit avoir moins de 18 caractères")
      .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+(?:[-_.][a-zA-Z0-9]+)*[-_]?$/, { message: "Le format du nom d'utilisateur est invalide" })
      .required("Le nom d'utilisateur est requis"),
    email: string().email("L'email doit être valide").required("l'email est requis"),
    password: string().min(6, "Le mot de passe doit faire plus de 6 caractères").required("Le mot de passe est requis"),
    confirmPassword: string().oneOf([yupRef("password")], "Les mots de passe doivent être identiques")
  })

  const forgottenPasswordSchema = object({
    email: string().email("L'email doit être valide").required("l'email est requis")
  })

  const changePasswordSchema = object({
    password: string().min(6, "Le mot de passe doit faire plus de 6 caractères").required("Le mot de passe est requis"),
    confirmPassword: string().oneOf([yupRef("password")], "Les mots de passe doivent être identiques")
  })

  return { loginSchema, registerSchema, forgottenPasswordSchema, changePasswordSchema }
})
