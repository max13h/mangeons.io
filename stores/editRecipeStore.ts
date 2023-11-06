import { object, string, number } from "yup"

export const useEditRecipeStore = defineStore("editRecipe", () => {
  const alimentaryProducts: globalThis.Ref<any[]> = ref([])
  const storeAreas: globalThis.Ref<any[]> = ref([])
  const kitchenEquipments: globalThis.Ref<any[]> = ref([])

  const schemaRecipe = object({
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
    cookingTime: number()
      .max(999, "le temps de préparation de être inferieur à 999")
      .moreThan(0, "le temps de préparation doit être superieur à 0")
      .truncate()
      .required("Le temps de préparation est requis"),
    content: string()
      .min(100, "le contenu doit avoir plus de 100 caractères")
      .trim()
      .required("Le contenu est requis")
  })

  const schemaAlimentaryProduct = object({
    quantity: number()
      .moreThan(0.1, "la quantité doit être supérieur à 0.1")
      .max(9999, "la quantité doit être inférieur à 9999")
      .truncate()
      .required("la quantité est requise"),
    unit: string()
      .matches(/^[a-zA-Z]+$/, "L'unité ne doit comprendre que des lettres")
      .required("L'unité est requise")
  })

  const name: globalThis.Ref<string> = ref("")
  const description: globalThis.Ref<string> = ref("")
  const content: globalThis.Ref<string> = ref("")
  const cookingTime: globalThis.Ref<number> = ref(0)
  const selectedKitchenEquipments: globalThis.Ref<KitchenEquipment[]> = ref([])
  const selectedAlimentaryProducts: globalThis.Ref<SelectedAlimentaryProduct[]> = ref([])

  return {
    alimentaryProducts,
    storeAreas,
    kitchenEquipments,
    schemaRecipe,
    schemaAlimentaryProduct,
    name,
    description,
    content,
    selectedAlimentaryProducts,
    selectedKitchenEquipments,
    cookingTime
  }
})
