import { serverSupabaseClient, serverSupabaseUser  } from "#supabase/server"

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const userAuth = await serverSupabaseUser(event)
  const recipeObject = await readBody(event)

  console.log(recipeObject);

  // const _fetchUserId = async () => {
  //   if (userAuth && userAuth.value) {
  //     const { data: userData, error: userError } = await supabase
  //       .from("users")
  //       .select("id")
  //       .eq("user_id", userAuth.value.id)

  //     if (userError) {
  //       throw new Error(`On fetch user \n ${JSON.stringify(userError, null, 2)}`)
  //     } else {
  //       return userData[0].id
  //     }
  //   } else {
  //     throw new Error("No userAuth && userAuth.value")
  //   }
  // }
  // const _postRecipe = async (userId: string) => {
  //   const { data: recipeData, error: recipeError } = await supabase
  //     .from("recipes")
  //     .insert([
  //       {
  //         name: recipeObject.name.trim(),
  //         description: recipeObject.description.trim(),
  //         content: recipeObject.content.trim(),
  //         author: userId,
  //         cooking_time: "recipeObject.cookingTime"
  //       }
  //     ])
  //     .select()

  //   if (recipeError) {
  //     throw new Error(`On post recipe \n ${JSON.stringify(recipeError, null, 2)}`)
  //   } else {
  //     return recipeData
  //   }
  // }
  // const _postRecipesAlimentaryProducts = async (recipeId: string) => {
  //   const formatedArray: RecipesAlimentaryProducts[] = []

  //   recipeObject.selectedAlimentaryProducts.forEach((obj) => {
  //     const formatedObject: RecipesAlimentaryProducts = {
  //       recipe_id: recipeId,
  //       alimentary_product_id: obj.details.id,
  //       quantity: obj.quantity,
  //       units: obj.units
  //     }
  //     formatedArray.push(formatedObject)
  //   })

  //   try {
  //     const { data: recipesAlimentaryProductsData, error: recipesAlimentaryProductsError } = await supabase
  //       .from("recipes_alimentary_products")
  //       .insert(formatedArray)
  //       .select()

  //     if (recipesAlimentaryProductsError) {
  //       throw new Error("ON POST ALIMENTARY PRODUCTS", { cause: recipesAlimentaryProductsError });
  //     } else {
  //       return recipesAlimentaryProductsData
  //     }
  //   } catch (error) {

  //   }
  // }
  // const _postRecipesKitchenEquipments = async (recipeId: string) => {
  //   const formatedArray: RecipesKitchenEquipments[] = []

  //   recipeStore.selectedKitchenEquipments.forEach((obj: KitchenEquipment) => {
  //     const el = {
  //       recipe_id: recipeId,
  //       kitchen_equipment_id: obj.id
  //     }
  //     formatedArray.push(el)
  //   })

  //   const { data: recipesKitchenEquipmentsData, error: recipesKitchenEquipmentsError } = await supabase
  //     .from("recipes_kitchen_equipments")
  //     .insert(formatedArray)
  //     .select()

  //   if (recipesKitchenEquipmentsError) {
  //     console.log("ON POST KITCHEN EQUIPMENT")
  //     throw new Error(recipesKitchenEquipmentsError)
  //   } else {
  //     return recipesKitchenEquipmentsData
  //   }
  // }

  // try {
  //   const userId = await _fetchUserId()
  //   const recipeData = await _postRecipe(userId[0].id)
  //   // const recipesAlimentaryProductsData = await _postRecipesAlimentaryProducts(recipeData[0].id)
  //   // const recipesKitchenEquipmentsData = await _postRecipesKitchenEquipments(recipeData[0].id)

  //   // return navigateTo("/recettes")
  // } catch (error) {
  //   console.error(error)
  // }
})
