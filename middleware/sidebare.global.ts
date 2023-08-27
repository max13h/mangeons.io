import { usePageStore } from "../stores/pageStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const store = usePageStore();
  store.isSideBarOpen = false;
});
