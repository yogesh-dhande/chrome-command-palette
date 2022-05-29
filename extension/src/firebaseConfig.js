// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

import { signInWithCustomToken } from "firebase/auth";

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
const db = getFirestore(firebaseApp);

const useFirebaseEmulators = true;
if (useFirebaseEmulators) {
  connectAuthEmulator(auth, "http://localhost:10000");
  connectFirestoreEmulator(db, "localhost", 10002);
}

export const store = {
  isLoggedIn: false,
  authUserId: null,
  readonly: {},
  currentUser: {},
};

auth.onAuthStateChanged(async (authUser) => {
  if (authUser) {
    store.authUserId = authUser.uid;
    store.isLoggedIn = true;
    onSnapshot(doc(db, "users", authUser.uid), (snap) => {
      store.currentUser = snap.data() || {};
    });
    onSnapshot(doc(db, "readonly", authUser.uid), (snap) => {
      store.readonly = snap.data() || {};
    });
  } else {
    store.authUserId = null;
    store.isLoggedIn = false;
    store.currentUser = {};
    store.currentUser = {};
  }
});

export async function login(token, store) {
  return await signInWithCustomToken(auth, token);
}
