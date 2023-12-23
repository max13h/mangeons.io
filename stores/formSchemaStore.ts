import { object, string, number, array, ref as yupRef } from "yup"

export const useFormSchemaStore = defineStore("formSchema", () => {
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
    newPassword: string().min(6, "Le mot de passe doit faire plus de 6 caractères").required("Le mot de passe est requis"),
    confirmNewPassword: string().oneOf([yupRef("newPassword")], "Les mots de passe doivent être identiques")
  })

  const schemaProfile = object({
    first_name: string()
      .max(25, "Le prénom doit être inferieur à 25")
      .notRequired(),
    last_name: string()
      .max(25, "Le nom de famille doit être inferieur à 25")
      .notRequired(),
    age: number()
      .moreThan(1, "L'age doit superieur à 1")
      .max(99, "L'age doit être inferieur à 99")
      .notRequired()
  })

  const _schemaSelectedKitchenEquipment = object({
    id: string().required(),
    name_fr: string().required(),
    image_url: string().required()
  })
  const _schemaSelectedAlimentaryProduct = object({
    details: object().shape(
      {
        id: string(),
        name_fr: string(),
        store_area_id: string(),
        guide_price: number(),
        image_url: string()
      }),
    quantity: number()
      .max(9999, "La quantité doit être inferieur à 9999")
      .moreThan(0, "La quantité doit être superieur à 0")
      .required("La quantité est requise"),
    unit: string()
      .min(1, "l'unité doit avoir plus de 1 caractère")
      .max(30, "l'unité doit avoir moins de 30 caractères")
      .required("L'unité est requise")
  })

  const recipeSchema = object({
    name: string()
      .min(6, "le nom doit avoir plus de 6 caractères")
      .max(80, "le nom doit avoir moins de 80 caractères")
      .trim()
      .required("Le nom est requis"),
    description: string()
      .min(6, "la description doit avoir plus de 6 caractères")
      .max(120, "la description avoir moins de 120 caractères")
      .trim()
      .required("La description est requise"),
    content: string()
      .min(100, "le contenu doit avoir plus de 100 caractères")
      .trim()
      .required("Le contenu est requis"),
    cookingTime: number()
      .max(999, "le temps de préparation doit être inferieur à 999")
      .moreThan(0, "le temps de préparation doit être superieur à 0")
      .truncate()
      .required("Le temps de préparation est requis"),
    category: string()
      .required("La catégorie est requise"),
    selectedKitchenEquipments: array(_schemaSelectedKitchenEquipment)
      .notRequired(),
    selectedAlimentaryProducts: array()
      .of(_schemaSelectedAlimentaryProduct)
      .min(1, "Votre recette à besoin au moins d'un ingrédient")
      .required("Au moins un ingrédient est requis à votre recette")
  })

  return {
    loginSchema,
    registerSchema,
    forgottenPasswordSchema,
    changePasswordSchema,
    schemaProfile,
    recipeSchema
  }
})
