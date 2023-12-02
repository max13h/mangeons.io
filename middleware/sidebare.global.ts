export default defineNuxtRouteMiddleware((_to, _from) => {
  const store = usePageStore()
  store.isSideBarOpen = false
})
