import { doc, onSnapshot } from "firebase/firestore";
import { defineStore } from "pinia";

const state = () => ({
  authUserId: null,
  token: null,
  currentUser: {},
  readonly: {},
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
      authUser.getIdToken(/* forceRefresh */ true).then((token) => {
        this.authUserId = authUser.uid;
        this.token = token;
        onSnapshot(doc(this.$firebase.db, "users", authUser.uid), (snap) => {
          this.currentUser = snap.data() || {};
        });
        onSnapshot(doc(this.$firebase.db, "readonly", authUser.uid), (snap) => {
          this.readonly = snap.data() || {};
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
