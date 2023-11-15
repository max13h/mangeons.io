import { usePageStore } from "../stores/pageStore"

export const useSetPageHeading = (heading: string) => {
  const store = usePageStore()
  store.heading = heading
}

export const useToggleSideBar = () => {
  const store = usePageStore()
  store.isSideBarOpen = !store.isSideBarOpen
}

export const useSetPageLayout = (finalLayoutString: string) => {
  const device = useDevice()
  setPageLayout(device.isDesktop ? false : "mobile-full")
}