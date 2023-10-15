export const useNewRecipeStore = defineStore("newRecipe", () => {
  const name: globalThis.Ref<any> = ref(undefined)
  const description: globalThis.Ref<any> = ref(undefined)
  const content: globalThis.Ref<any> = ref(undefined)
  const ingredients = ref([])

  return { name, description, content, ingredients }
})
