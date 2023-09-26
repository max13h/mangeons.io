export const usePageStore = defineStore("page", () => {
  const isSideBarOpen = ref(false)
  const heading = ref("Loading")

  return { heading, isSideBarOpen }
})
