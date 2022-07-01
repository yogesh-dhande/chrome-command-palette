// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { categories } from "./content-scripts/commands";

const firebaseConfig = {
  apiKey: "AIzaSyCdNGL1QkKTdQww_q6sUi_ansozZ39QIk0",
  authDomain: "singledispatch.firebaseapp.com",
  projectId: "singledispatch",
  storageBucket: "singledispatch.appspot.com",
  messagingSenderId: "213398833059",
  appId: "1:213398833059:web:43d99702d42d45621cbc16",
};

let firebaseApp;
const apps = getApps();
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = apps[0];
}

const auth = getAuth(firebaseApp);

if (import.meta.env.VITE_USE_FIREBASE_EMULATORS) {
  connectAuthEmulator(auth, "http://localhost:10000");
}

export const store = {
  isLoggedIn: false,
  authUserId: null,
  currentUser: {
    preferences: {},
  },
};

auth.onAuthStateChanged(async (authUser) => {
  if (authUser) {
    store.authUserId = authUser.uid;
    store.isLoggedIn = true;
  } else {
    store.authUserId = null;
    store.isLoggedIn = false;
    store.currentUser = {
      preferences: {
        debug: false,
        showAllTab: true,
        categoriesInAllTab: [
          categories.PAGE,
          categories.TABS,
          categories.BOOKMARKS,
        ],
        additionalCategories: [
          categories.PAGE,
          categories.TABS,
          categories.BOOKMARKS,
        ],
      },
    };
  }
});

export async function login(token) {
  return await signInWithCustomToken(auth, token);
}

export async function logout() {
  return await signOut(auth);
}
