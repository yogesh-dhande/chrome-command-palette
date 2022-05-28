import { useStore } from "~/store";

export default function ({ $pinia, redirect }) {
  const store = useStore($pinia);
  // If the user is not authenticated
  if (!store.loggedIn) {
    return redirect("/login?redirect=/");
  }
}
