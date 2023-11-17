import { object, string, number } from "yup"

export const useProfileStore = defineStore("profile", () => {
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

  return { schemaProfile }
})
