export const useNewRecipeStore = defineStore("newRecipe", () => {
  const name = ref(undefined)
  const description = ref(undefined)
  const content = ref(undefined)

  return { name, description, content }
})
