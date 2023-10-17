import { useNewRecipeStore } from "../stores/newRecipeStore"

export const useAddIngredientsModal = async () => {
  const newRecipeStore = useNewRecipeStore()

  useOpenModal("addIngredients")

  const { data: { value: { data: alimentaryProduct } } } = await useFetch("/api/getAlimentaryProducts")
  const { data: { value: { data: storeAreas } } } = await useFetch("/api/getStoreAreas")

  newRecipeStore.alimentaryProduct = alimentaryProduct
  newRecipeStore.storeAreas = storeAreas
}

export const useSaveNewRecipe = async () => {
  const newRecipeStore = useNewRecipeStore()
  const supabase: any = useSupabaseClient()
  const userAuth = useSupabaseUser()

  const { data: userId } = await supabase
    .from("users")
    .select("id")
    .eq("user_id", userAuth.value.id)

  const { data: recipeData, error: recipeError } = await supabase
    .from("recipes")
    .insert([
      {
        name: newRecipeStore.name.value,
        description: newRecipeStore.description.value,
        content: newRecipeStore.content.value,
        author: userId[0].id,
        cooking_time: "1 hour"
      }
    ])
    .select()

  if (recipeError) {
    return console.log("An error occures during the recipe creation")
  }

  let errorDuringIngredientInsert = false

  newRecipeStore.ingredients.forEach( async (obj) => {
    const { data: alimentaryProductRecipeData, error: alimentaryProductsRecipesError } = await supabase
      .from("alimentary_products_recipes")
      .insert([
        {
          recipe_id: recipeData[0].id,
          alimentary_product_id: obj.details.id,
          quantity: obj.quantity,
          units: obj.units
        }
      ])
      .select()

    if (alimentaryProductsRecipesError) {
      errorDuringIngredientInsert = true
      console.log(alimentaryProductsRecipesError)
    }
  })

  if (errorDuringIngredientInsert || recipeError) {
    console.log("errorrrr")
  } else if (recipeData && !errorDuringIngredientInsert) {
    return navigateTo("/recettes")
  }
}
