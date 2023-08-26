export const usePageStore = defineStore("page", () => {
  const isSideBarOpen = ref(false);
  const heading = ref("Menus");

  return { heading, isSideBarOpen };
});
