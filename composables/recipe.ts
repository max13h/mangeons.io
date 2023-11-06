export const useAddAlimentaryProductsModal = async () => {
  const recipeStore = useRecipeStore()

  useOpenModal("addAlimentaryProducts")

  try {
    const alimentaryProductsResponse = await useFetch("/api/getAlimentaryProducts")
    const storeAreasResponse = await useFetch("/api/getStoreAreas")

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

export const useParseStringToStepListObject = (listString: string) => {
  // Split the string into lines and remove the empty line
  const lines = listString.split("\n")

  const finalArrayOfObjects: any[] = []
  let previousLineNumber = 0

  for (let line of lines) {
    const nestingLevel = line.search(/\S/)

    line = line.trim()
    const lineNumber = parseInt(line[0])

    if (nestingLevel > 0) {
      const nestedObject = {
        id: finalArrayOfObjects[previousLineNumber - 1].nested.length,
        value: line.substring(3),
        index: finalArrayOfObjects[previousLineNumber - 1].nested.length
      }
      finalArrayOfObjects[previousLineNumber - 1].nested.push(nestedObject)
    } else {
      previousLineNumber = lineNumber

      const object = {
        id: finalArrayOfObjects.length,
        value: line.substring(3),
        index: finalArrayOfObjects.length,
        nested: []
      }
      finalArrayOfObjects.push(object)
    }
  }
  return finalArrayOfObjects
}

export const useFetchRecipeData = async (recipeId: any) => {
  const {
    data: recipeData,
    status: recipeStatus
  }: { data: any, error: any, status: any } = await useFetch("/api/recipe", {
    method: "get",
    query: { id: recipeId }
  })

  const {
    data: kitchenEquipmentsData,
    status: kitchenEquipmentsStatus
  }: { data: any, error: any, status: any} = await useFetch("/api/editRecipe/kitchenEquipmentsRecipe", {
    method: "get",
    query: { id: recipeId }
  })

  const {
    data: alimentaryProductsData,
    status: alimentaryProductsStatus
  }: { data: any, error: any, status: any} = await useFetch("/api/editRecipe/alimentaryProductsRecipe", {
    method: "get",
    query: { id: recipeId }
  })

  const isErrorStatus = [recipeStatus, kitchenEquipmentsStatus, alimentaryProductsStatus].includes("error")

  const doesFetchReturnNullData = recipeData.value === null || kitchenEquipmentsData.value === null || alimentaryProductsData.value === null

  const doesSupaBaseReturnNullData = !doesFetchReturnNullData ? (recipeData.value.data === null || kitchenEquipmentsData.value.data === null || alimentaryProductsData.value.data === null) : false

  if (isErrorStatus) {
    throw new Error("An API call return a status 'error'")
  } else if (doesFetchReturnNullData) {
    throw new Error("An API call return empty data")
  } else if (doesSupaBaseReturnNullData) {
    throw new Error(`recipeData: ${recipeData.value.error.message || "null"} | kitchenEquipmentsData: ${kitchenEquipmentsData.value.error.message || "null"} | alimentaryProductsData: ${alimentaryProductsData.value.error.message || "null"} |`)
  } else {
    return { recipeData, kitchenEquipmentsData, alimentaryProductsData }
  }
}
