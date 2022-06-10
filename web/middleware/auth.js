import { useStore } from "@/store";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to);
  const store = useStore();
  if (store.loggedIn) {
    return navigateTo("/login?redirect=/");
  }
});
