import { object, string, number, array } from "yup"

export const useRecipeStore = defineStore("recipe", () => {
  const alimentaryProducts: globalThis.Ref<any[]> = ref([])
  const storeAreas: globalThis.Ref<any[]> = ref([])
  const kitchenEquipments: globalThis.Ref<any[]> = ref([])

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

  const schemaNewRecipe = object({
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
    selectedKitchenEquipments: array(_schemaSelectedKitchenEquipment)
      .notRequired(),
    selectedAlimentaryProducts: array()
      .of(_schemaSelectedAlimentaryProduct)
      .min(1, "Votre recette à besoin au moins d'un ingrédient")
      .required("Au moins un ingrédient est requis à votre recette")
  })

  const selectedKitchenEquipments: globalThis.Ref<KitchenEquipment[]> = ref([])
  const selectedAlimentaryProducts: globalThis.Ref<SelectedAlimentaryProduct[]> = ref([])

  return {
    alimentaryProducts,
    storeAreas,
    kitchenEquipments,
    schemaNewRecipe,
    selectedAlimentaryProducts,
    selectedKitchenEquipments
  }
})
