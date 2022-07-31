import { useStore } from "@/store";

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore();
  if (store.loggedIn) {
    return navigateTo("/tips");
  }
});
