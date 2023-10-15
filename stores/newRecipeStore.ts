export const useNewRecipeStore = defineStore("newRecipe", () => {
  const name = ref(undefined)
  const description = ref(undefined)
  const content = ref(undefined)
  const ingredients = ref([])

  return { name, description, content, ingredients }
})
