export const useSetPageHeading = (heading: string) => {
  const store = usePageStore()
  store.heading = heading
}

export const useToggleSideBar = () => {
  const store = usePageStore()
  store.isSideBarOpen = !store.isSideBarOpen
}
