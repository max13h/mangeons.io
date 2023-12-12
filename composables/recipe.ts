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

export const useUploadRecipeImage = async (recipeId: string, uploadedFile: any, oldImageUrl: string = null) => {
  const modalStore = useModalStore()
  modalStore.close()

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  if (user.value) {
    const newImageName = `${recipeId}_${Date.now()}.jpg`

    const { error: postImageError } = await useAsyncData(async () => {
      const { error } = await supabase.storage
        .from("recipes")
        .upload(`${user.value.id}/${newImageName}`, uploadedFile)

      useHandleSupabaseReturnError(error)
    })

    useHandleFetchError(postImageError)

    if (oldImageUrl) {
      const { error: removeOldImageError } = await useAsyncData(async () => {
        const match = oldImageUrl.match(/(?<=recipes\/).*$/)

        const { error } = await supabase
          .storage
          .from("recipes")
          .remove([match[0]])

        useHandleSupabaseReturnError(error)
      })

      useHandleFetchError(removeOldImageError)
    }

    const { error: updateImageUrlError } = await useAsyncData(async () => {
      const { data } = supabase.storage
        .from("recipes")
        .getPublicUrl(`${user.value.id}/${newImageName}`)

      if (!data) {
        throw new Error("No public URL")
      }

      const { error: insertError } = await supabase
        .from("recipes")
        .update({ image_url: data.publicUrl })
        .eq("id", recipeId)

      useHandleSupabaseReturnError(insertError)
    })

    useHandleFetchError(updateImageUrlError)
  } else {
    useErrorNotice()
  }

  window.location.reload(true)
}
