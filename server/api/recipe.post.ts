import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const userAuth = await serverSupabaseUser(event)
  const recipeObject = await readBody(event)

  const _fetchUserId = async () => {
    if (userAuth && userAuth.id) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", userAuth.id) as any

      if (userError) {
        throw new Error(`ON FETCH USER \n ${JSON.stringify(userError, null, 2)}`)
      } else {
        return userData[0].id
      }
    } else {
      throw new Error("No userAuth && userAuth.value")
    }
  }
  const _postRecipe = async (userId: string) => {
    const { data: recipeData, error: recipeError }: { data: any, error: any } = await supabase
      .from("recipes")
      .insert({
        name: recipeObject.name.trim(),
        description: recipeObject.description.trim(),
        content: recipeObject.content.trim(),
        author: userId,
        cooking_time: recipeObject.cookingTime
      } as any)
      .select()

    if (recipeError) {
      throw new Error(`ON POST RECIPE \n ${JSON.stringify(recipeError, null, 2)}`)
    } else {
      return recipeData[0].id
    }
  }
  const _postRecipesAlimentaryProducts = async (currentRecipeId: string) => {
    const formatedArray: RecipesAlimentaryProducts[] = []

    recipeObject.selectedAlimentaryProducts.forEach((obj: SelectedAlimentaryProduct) => {
      const formatedObject: RecipesAlimentaryProducts = {
        recipe_id: currentRecipeId,
        alimentary_product_id: obj.details.id,
        quantity: obj.quantity,
        unit: obj.unit
      }
      formatedArray.push(formatedObject)
    })

    const { error: recipesAlimentaryProductsError } = await supabase
      .from("recipes_alimentary_products")
      .insert(formatedArray as any)

    if (recipesAlimentaryProductsError) {
      throw new Error(`ON POST ALIMENTARY PRODUCTS \n ${JSON.stringify(recipesAlimentaryProductsError, null, 2)}`)
    }
  }
  const _postRecipesKitchenEquipments = async (currentRecipeId: string) => {
    const formatedArray: RecipesKitchenEquipments[] = []

    if (recipeObject.selectedKitchenEquipments.length === 0) {
      return
    }

    recipeObject.selectedKitchenEquipments.forEach((obj: KitchenEquipment) => {
      const formatedObject = {
        recipe_id: currentRecipeId,
        kitchen_equipment_id: obj.id
      }
      formatedArray.push(formatedObject)
    })

    const { error: recipesKitchenEquipmentsError } = await supabase
      .from("recipes_kitchen_equipments")
      .insert(formatedArray as any)

    if (recipesKitchenEquipmentsError) {
      throw new Error(`ON POST KITCHEN EQUIPMENT \n ${JSON.stringify(recipesKitchenEquipmentsError, null, 2)}`)
    }
  }

  try {
    const userId = await _fetchUserId()
    const recipeId = await _postRecipe(userId)
    await _postRecipesAlimentaryProducts(recipeId)
    await _postRecipesKitchenEquipments(recipeId)

    return recipeId
  } catch (error) {
    console.error(error)
  }
})
