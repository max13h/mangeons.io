import { usePageStore } from "../stores/pageStore"

export const useSetPageHeading = (heading: string) => {
  const store = usePageStore()
  store.heading = heading
}

export const useToggleSideBar = () => {
  const store = usePageStore()
  store.isSideBarOpen = !store.isSideBarOpen
}

export const useCapitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
