import { httpsCallable } from "firebase/functions";
import { doc, onSnapshot } from "firebase/firestore";
import { defineStore } from "pinia";

const state = () => ({
  authUserId: null,
  token: null,
  currentUser: {},
});

const getters = {
  loggedIn(state) {
    return state.authUserId && state.currentUser.name !== "demo";
  },
};

const actions = {
  onAuthStateChangedAction(authUser) {
    if (!authUser) {
      // remove state
      this.currentUser = {};
      this.token = null;
      this.authUserId = null;
    } else {
      authUser.getIdToken(/* forceRefresh */ true).then(async (token) => {
        this.authUserId = authUser.uid;
        this.token = token;

        const { $firebase } = useNuxtApp();

        chrome.runtime.sendMessage(
          useRuntimeConfig().public.extensionID,
          await httpsCallable(
            $firebase.functions,
            "createCustomToken"
          )(authUser.uid)
        );

        onSnapshot(doc($firebase.db, "users", authUser.uid), (snap) => {
          this.currentUser = snap.data() || {};
        });
      });
    }
  },
  setAuthState(authUser) {
    this.authUserId = authUser.uid;
  },
  setUserData(userData) {
    this.currentUser = userData;
  },
  setToken(token) {
    this.token = token;
  },
};

export const useStore = defineStore({
  id: "store",
  state,
  getters,
  actions,
});
