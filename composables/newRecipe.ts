export const useAddAlimentaryProductsModal = async () => {
  const recipeStore = useRecipeStore()

  useOpenModal("addAlimentaryProducts")

  interface AlimentaryProduct {
    id: number;
    name_fr: string;
    store_area_id: number;
    image_url: string;
  }
  interface StoreArea {
    id: number;
    name: string;
    name_fr: string;
  }

  interface AlimentaryProductsResponse {
    data: {
      value: {
        data: AlimentaryProduct[]; // Define the type for AlimentaryProduct
      };
    };
  }
  interface StoreAreasResponse {
    data: {
      value: {
        data: StoreArea[]; // Define the type for StoreArea
      };
    };
  }

  try {
    const alimentaryProductsResponse = await useFetch<AlimentaryProductsResponse>("/api/getAlimentaryProducts")
    const storeAreasResponse = await useFetch<StoreAreasResponse>("/api/getStoreAreas")

    recipeStore.alimentaryProducts = alimentaryProductsResponse.data.value.data
    recipeStore.storeAreas = storeAreasResponse.data.value.data
  } catch (error) {
    console.log(error)
  }
}

export const useAddKitchenEquipmentsModal = async () => {
  const recipeStore = useRecipeStore()

  useOpenModal("addKitchenEquipments")

  const { data: { value: { data: kitchenEquipments } } } = await useFetch("/api/getKitchenEquipments")

  recipeStore.kitchenEquipments = kitchenEquipments
}

export const useSaveRecipe = async () => {
  const recipeStore = useRecipeStore()
  const supabase: any = useSupabaseClient()
  const userAuth = useSupabaseUser()

  interface SelectedAlimentaryProduct {
    details: {
      id: string;
      name_fr: string;
      store_area_id: string;
      guide_price: string;
      image_url: string;
    };
    quantity: number;
    units: string;
  }
  interface SelectedKitchenEquipment {
    id: string;
    image_url: string;
    name_fr: string;
  }

  const schemaNewRecipe = recipeStore.schemaNewRecipe
  const schemaAlimentaryProduct = recipeStore.schemaAlimentaryProduct

  const newRecipe = {
    name: recipeStore.name,
    description: recipeStore.description,
    content: recipeStore.content,
    cookingTime: recipeStore.cookingTime
  }

  const isNewRecipeValid = schemaNewRecipe.isValidSync(newRecipe)

  const areSelectedAlimentaryProductValid = () => {
    let isValid = true
    recipeStore.selectedAlimentaryProducts.forEach((alimentaryProduct) => {
      const a = schemaAlimentaryProduct.isValidSync({
        quantity: alimentaryProduct.quantity,
        units: alimentaryProduct.units
      })

      if (!a) {
        isValid = false
      }
    })

    return isValid
  }

  const _fetchUserId = async () => {
    const { data: userId, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("user_id", userAuth.value.id)

    if (userError) {
      console.log("ON FETCH USER");
      throw new Error(userError)
    } else {
      return userId
    }
  }
  const _postRecipe = async (userId: any[]) => {
    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .insert([
        {
          name: recipeStore.name.trim(),
          description: recipeStore.description.trim(),
          content: recipeStore.content.trim(),
          author: userId,
          cooking_time: recipeStore.cookingTime
        }
      ])
      .select()

    if (recipeError) {
      console.log("ON POST RECIPE")
      console.log(userId)
      for(const property in recipeError) {
        console.log(property + "=" + recipeError[property])
      }
      throw new Error(recipeError)
    } else {
      return recipeData
    }
  }
  const _postRecipesAlimentaryProducts = async (recipeId: string) => {
    interface FormatedObj {
      recipe_id: string;
      alimentary_product_id: string;
      quantity: number;
      units: string;
    }

    const formatedArray: FormatedObj[] = []

    recipeStore.selectedAlimentaryProducts.forEach((obj: SelectedAlimentaryProduct) => {
      const el = {
        recipe_id: recipeId,
        alimentary_product_id: obj.details.id,
        quantity: obj.quantity || 0,
        units: obj.units || ""
      }
      formatedArray.push(el)
    })

    const { data: recipesAlimentaryProductsData, error: recipesAlimentaryProductsError } = await supabase
      .from("recipes_alimentary_products")
      .insert(formatedArray)
      .select()

    if (recipesAlimentaryProductsError) {
      console.log("ON POST ALIMENTARY PRODUCTS")
      throw new Error(recipesAlimentaryProductsError);
    } else {
      return recipesAlimentaryProductsData
    }
  }
  const _postRecipesKitchenEquipments = async (recipeId: string) => {
    interface FormatedObj {
      recipe_id: string;
      kitchen_equipment_id: string;
    }

    const formatedArray: FormatedObj[] = []

    recipeStore.selectedKitchenEquipments.forEach((obj: SelectedKitchenEquipment) => {
      const el = {
        recipe_id: recipeId,
        kitchen_equipment_id: obj.id
      }
      formatedArray.push(el)
    })

    const { data: recipesKitchenEquipmentsData, error: recipesKitchenEquipmentsError } = await supabase
      .from("recipes_kitchen_equipments")
      .insert(formatedArray)
      .select()

    if (recipesKitchenEquipmentsError) {
      console.log("ON POST KITCHEN EQUIPMENT")
      throw new Error(recipesKitchenEquipmentsError)
    } else {
      return recipesKitchenEquipmentsData
    }
  }

  if (isNewRecipeValid && areSelectedAlimentaryProductValid()) {
    try {
      const userId = await _fetchUserId()
      console.log(userId)
      const recipeData = await _postRecipe(userId[0].id)
      console.log(recipeData)
      const recipesAlimentaryProductsData = await _postRecipesAlimentaryProducts(recipeData[0].id)
      console.log(recipesAlimentaryProductsData)
      const recipesKitchenEquipmentsData = await _postRecipesKitchenEquipments(recipeData[0].id)
      console.log(recipesKitchenEquipmentsData)

      return navigateTo("/recettes")
    } catch (error) {
      console.log("ERRORRRRR:", error)
    }
  } else {
    console.log("an error occures")
  }
}
