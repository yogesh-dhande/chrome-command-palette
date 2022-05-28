import { useStore } from "~/store";

export default function ({ $pinia, redirect }) {
  const store = useStore($pinia);
  if (store.loggedIn) {
    return redirect("/");
  }
}
